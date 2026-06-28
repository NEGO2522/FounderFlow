import express from 'express'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const router = express.Router()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Verify session token
router.post('/verify', async (req, res) => {
  const { token } = req.body
  if (!token) return res.status(400).json({ error: 'No token provided' })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error) return res.status(401).json({ error: 'Invalid token' })

  res.json({ user })
})

// Get user profile
router.get('/profile', async (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'No token' })

  const { data: { user }, error } = await supabase.auth.getUser(token)
  if (error) return res.status(401).json({ error: 'Unauthorized' })

  res.json({ 
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name,
    avatar: user.user_metadata?.avatar_url,
    provider: user.app_metadata?.provider
  })
})

// Check if email is registered
router.post('/check-email', async (req, res) => {
  const { email } = req.body
  if (!email) return res.status(400).json({ error: 'Email required' })

  const { data, error } = await supabase
    .from('auth.users')
    .select('email')
    .eq('email', email)
    .single()

  if (error || !data) {
    return res.json({ exists: false })
  }
  res.json({ exists: true })
})

export default router
