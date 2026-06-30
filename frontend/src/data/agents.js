export const initialAgents = [
  {
    id: 'sora',
    name: 'Sora',
    role: 'Marketing Specialist',
    avatar: 'SO',
    enabled: true,
    model: 'gpt-4o-mini',
    activeTask: 'Ready for marketing tasks',
    messages: [
      {
        sender: 'agent',
        text: 'Hey! I am Sora, your marketing specialist. Tell me about your product and I will help you with growth strategy, campaigns, copy, and more.',
        timestamp: new Date().toTimeString().slice(0, 5)
      }
    ]
  },
  {
    id: 'friday',
    name: 'Friday',
    role: 'Coding Specialist',
    avatar: 'FR',
    enabled: true,
    model: 'gpt-4o-mini',
    activeTask: 'Ready for coding tasks',
    messages: [
      {
        sender: 'agent',
        text: 'Hey! I am Friday, your coding specialist. Share your technical challenges and I will help you build, debug, and ship faster.',
        timestamp: new Date().toTimeString().slice(0, 5)
      }
    ]
  },
  {
    id: 'lora',
    name: 'Lora',
    role: 'Opportunities Finder',
    avatar: 'LO',
    enabled: true,
    model: 'gpt-4o-mini',
    activeTask: 'Ready to find opportunities',
    messages: [
      {
        sender: 'agent',
        text: 'Hey! I am Lora, your opportunities finder. I help you discover funding, partnerships, market gaps, and growth opportunities for your product.',
        timestamp: new Date().toTimeString().slice(0, 5)
      }
    ]
  },
  {
    id: 'siru',
    name: 'Siru',
    role: 'Brain Storming',
    avatar: 'SI',
    enabled: true,
    model: 'gpt-4o-mini',
    activeTask: 'Ready to brainstorm',
    messages: [
      {
        sender: 'agent',
        text: 'Hey! I am Siru, your brainstorming partner. Got a problem or idea? Let us think it through together and come up with creative solutions.',
        timestamp: new Date().toTimeString().slice(0, 5)
      }
    ]
  },
  {
    id: 'ena',
    name: 'Ena',
    role: 'General Assistant',
    avatar: 'EN',
    enabled: true,
    model: 'gpt-4o-mini',
    activeTask: 'Ready to help',
    messages: [
      {
        sender: 'agent',
        text: 'Hey! I am Ena, your general assistant. Ask me anything about your product, business, or anything else. I am here to help.',
        timestamp: new Date().toTimeString().slice(0, 5)
      }
    ]
  }
]
