import express from 'express'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const agentPersonas = {
  sora: "You are Sora, a marketing specialist AI co-founder. You help with growth strategy, campaigns, social media, copywriting, and branding. Be practical, creative, and concise.",
  friday: "You are Friday, a coding specialist AI co-founder. You help with architecture, debugging, code review, and technical decisions. Be precise and give working code when needed.",
  lora: "You are Lora, an opportunities finder AI co-founder. You help find funding, grants, partnerships, market gaps, and growth opportunities. Be resourceful and specific.",
  siru: "You are Siru, a brainstorming AI co-founder. You help generate ideas, solve problems creatively, and think through strategy. Be imaginative but grounded.",
  ena: "You are Ena, a general assistant AI co-founder. You help with anything the founder needs - planning, writing, research, or just talking through problems. Be helpful and warm."
}

// ━━━━━━━━━━━━━━━━━━
// Provider-specific call functions
// ━━━━━━━━━━━━━━━━━━

async function callOpenAI(apiKey, messages) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 800,
      temperature: 0.7
    })
  })
  const data = await response.json()
  if (data.error) {
    throw new Error(mapOpenAIError(data.error))
  }
  return data.choices[0].message.content
}

async function callClaude(apiKey, messages) {
  const systemMsg = messages.find(m => m.role === 'system')
  const otherMsgs = messages.filter(m => m.role !== 'system')
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 800,
      system: systemMsg?.content || '',
      messages: otherMsgs
    })
  })
  const data = await response.json()
  if (data.error) {
    throw new Error(mapClaudeError(data.error))
  }
  return data.content[0].text
}

async function callGemini(apiKey, messages) {
  const systemMsg = messages.find(m => m.role === 'system')
  const otherMsgs = messages.filter(m => m.role !== 'system')
  
  const contents = otherMsgs.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }))

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: systemMsg?.content || '' }] },
        generationConfig: { maxOutputTokens: 800, temperature: 0.7 }
      })
    }
  )
  const data = await response.json()
  if (data.error) {
    throw new Error(mapGeminiError(data.error))
  }
  return data.candidates[0].content.parts[0].text
}

async function callNvidia(apiKey, messages) {
  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'meta/llama-3.1-70b-instruct',
      messages,
      max_tokens: 800,
      temperature: 0.7
    })
  })
  const data = await response.json()
  if (data.error) {
    throw new Error(data.error.message || 'NVIDIA API error')
  }
  return data.choices[0].message.content
}

// ━━━━━━━━━━━━━━━━━━
// Error mappers
// ━━━━━━━━━━━━━━━━━━

function mapOpenAIError(error) {
  if (error.code === 'invalid_api_key') return 'Your OpenAI key is invalid. Check it in Settings.'
  if (error.code === 'insufficient_quota') return 'Your OpenAI account has run out of credits.'
  return error.message || 'OpenAI API error'
}

function mapClaudeError(error) {
  if (error.type === 'authentication_error') return 'Your Claude key is invalid. Check it in Settings.'
  if (error.type === 'rate_limit_error') return 'Claude rate limit reached. Try again shortly.'
  return error.message || 'Claude API error'
}

function mapGeminiError(error) {
  if (error.code === 400) return 'Your Gemini key is invalid. Check it in Settings.'
  return error.message || 'Gemini API error'
}

// ━━━━━━━━━━━━━━━━━━
// Main route
// ━━━━━━━━━━━━━━━━━━

router.post('/send', async (req, res) => {
  const { token, agentId, message, projectContext, history } = req.body

  if (!token || !agentId || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('provider_api_key, ai_provider')
    .eq('id', user.id)
    .single()

  if (profileError || !profile?.provider_api_key) {
    return res.status(400).json({ 
      error: 'No API key found. Add your AI key in Settings.' 
    })
  }

  const provider = profile.ai_provider || 'openai'
  const apiKey = profile.provider_api_key

  const persona = agentPersonas[agentId] || agentPersonas.ena
  const systemPrompt = `${persona}\n\nProject context: ${projectContext || 'No project context yet.'}`

  const messages = [
    { role: 'system', content: systemPrompt },
    ...(history || []).slice(-10).map(h => ({
      role: h.sender === 'user' ? 'user' : 'assistant',
      content: h.text
    })),
    { role: 'user', content: message }
  ]

  try {
    let reply

    switch (provider) {
      case 'openai':
        reply = await callOpenAI(apiKey, messages)
        break
      case 'claude':
        reply = await callClaude(apiKey, messages)
        break
      case 'gemini':
        reply = await callGemini(apiKey, messages)
        break
      case 'nvidia':
        reply = await callNvidia(apiKey, messages)
        break
      default:
        return res.status(400).json({ error: 'Unknown provider selected.' })
    }

    res.json({ reply })
  } catch (err) {
    console.error(`${provider} call failed:`, err.message)
    res.status(400).json({ error: err.message || 'Failed to get AI response' })
  }
})

export default router
