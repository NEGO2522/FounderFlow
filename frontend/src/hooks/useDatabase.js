import { supabase } from '../lib/supabase'

export function useDatabase(user) {

  // Save project to Supabase
  const saveProject = async (project) => {
    if (!user) return
    
    const { error } = await supabase
      .from('projects')
      .upsert({
        id: project.id,
        user_id: user.id,
        name: project.name,
        status: project.status,
        stack: project.stack,
        agents: project.agents
      })
    
    if (error) console.error('Save project error:', error)
  }

  // Save roadmap tasks
  const saveTasks = async (projectId, tasks) => {
    if (!user) return
    
    await supabase
      .from('roadmap_tasks')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', user.id)

    const { error } = await supabase
      .from('roadmap_tasks')
      .insert(tasks.map((task, idx) => ({
        project_id: projectId,
        user_id: user.id,
        text: task.text,
        completed: task.completed,
        position: idx
      })))
    
    if (error) console.error('Save tasks error:', error)
  }

  // Load all projects from Supabase
  const loadProjects = async () => {
    if (!user) return null

    const { data: projects, error: pError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
    
    if (pError || !projects?.length) return null

    const { data: tasks } = await supabase
      .from('roadmap_tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('position')

    const projectsList = {}
    projects.forEach(p => {
      projectsList[p.id] = {
        id: p.id,
        name: p.name,
        status: p.status,
        stack: p.stack,
        agents: p.agents || [],
        idea_text: p.idea_text,
        roadmap: (tasks || [])
          .filter(t => t.project_id === p.id)
          .map(t => ({
            id: t.id,
            text: t.text,
            completed: t.completed
          }))
      }
    })

    return projectsList
  }

  // Save agents
  const saveAgents = async (agents) => {
    if (!user) return

    await supabase
      .from('agents')
      .delete()
      .eq('user_id', user.id)

    const { error } = await supabase
      .from('agents')
      .insert(agents.map(a => ({
        id: a.id,
        user_id: user.id,
        name: a.name,
        role: a.role,
        avatar: a.avatar,
        enabled: a.enabled,
        model: a.model || a.activeModel,
        active_task: a.activeTask,
        link: a.link || ''
      })))

    if (error) console.error('Save agents error:', error)
  }

  // Load agents
  const loadAgents = async () => {
    if (!user) return null

    const { data, error } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', user.id)

    if (error || !data?.length) return null

    return data.map(a => ({
      id: a.id,
      name: a.name,
      role: a.role,
      avatar: a.avatar,
      enabled: a.enabled,
      model: a.model,
      activeTask: a.active_task,
      link: a.link,
      status: 'Active',
      messages: [
        {
          sender: 'agent',
          text: `${a.name} workspace restored. Ready for directives.`,
          timestamp: new Date().toTimeString().slice(0, 5)
        }
      ]
    }))
  }

  // Save messages for an agent
  const saveMessages = async (agentId, messages) => {
    if (!user) return
    
    // Delete old messages for this agent
    await supabase
      .from('messages')
      .delete()
      .eq('user_id', user.id)
      .eq('agent_id', agentId)

    if (!messages || messages.length === 0) return

    // Insert new messages
    const rows = messages.map(m => ({
      user_id: user.id,
      agent_id: agentId,
      sender: m.sender,
      text: m.text,
      artifact: m.artifact || null,
      timestamp: m.timestamp
    }))

    const { error } = await supabase
      .from('messages')
      .insert(rows)

    if (error) console.error('Save messages error:', error)
  }

  // Load all messages for all agents
  const loadMessages = async () => {
    if (!user) return null

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error || !data) return null

    // Group by agent_id
    const grouped = {}
    data.forEach(m => {
      if (!grouped[m.agent_id]) grouped[m.agent_id] = []
      grouped[m.agent_id].push({
        sender: m.sender,
        text: m.text,
        artifact: m.artifact,
        timestamp: m.timestamp
      })
    })

    return grouped
  }

  return { 
    saveProject, 
    saveTasks, 
    loadProjects, 
    saveAgents, 
    loadAgents,
    saveMessages,
    loadMessages
  }
}
