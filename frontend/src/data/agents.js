export const initialAgents = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    role: 'General Intelligence',
    avatar: 'GP',
    status: 'Active',
    enabled: true,
    model: 'GPT-4o',
    activeTask: 'Analyzing product copy and user retention patterns',
    messages: [
      { sender: 'agent', text: "Workspace loaded. I have analyzed current acquisition rates and retention statistics.", timestamp: '19:02' }
    ]
  },
  {
    id: 'claude',
    name: 'Claude',
    role: 'Reasoning & Writing',
    avatar: 'CL',
    status: 'Working',
    enabled: true,
    model: 'Claude 3.5 Sonnet',
    activeTask: 'Refactoring workspace routes and layout files',
    messages: [
      { sender: 'agent', text: "Workspace refactoring in progress. Constructed modular components and clean directories.", timestamp: '19:10',
        artifact: {
          title: 'routes.json',
          content: `{
  "routes": [
    { "path": "/", "component": "LoginPage" },
    { "path": "/signup", "component": "SignUpPage" },
    { "path": "/dashboard", "component": "DashboardPage" }
  ]
}`
        }
      }
    ]
  },
  {
    id: 'gemini',
    name: 'Gemini',
    role: 'Multimodal AI',
    avatar: 'GM',
    status: 'Idle',
    enabled: true,
    model: 'Gemini 1.5 Pro',
    activeTask: 'Awaiting instruction',
    messages: [
      { sender: 'agent', text: "Multimodal ingestion pipeline ready. Input images or diagrams to begin.", timestamp: '18:50' }
    ]
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    role: 'Research & Search',
    avatar: 'PX',
    status: 'Active',
    enabled: true,
    model: 'Perplexity Search',
    activeTask: 'Scraping competitor benchmarks',
    messages: [
      { sender: 'agent', text: "Competitor reports compiled. Food Delivery App benchmarks exported.", timestamp: '18:34' }
    ]
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    role: 'Code & Reasoning',
    avatar: 'DS',
    status: 'Working',
    enabled: true,
    model: 'DeepSeek Coder',
    activeTask: 'Optimizing SQL query database plan execution',
    messages: [
      { sender: 'agent', text: "Fuzzing queries. Created indices for order tracking geospatial coordinates.", timestamp: '19:15',
        artifact: {
          title: 'index.sql',
          content: `CREATE INDEX idx_orders_coords ON orders USING gist(tracker_coords);`
        }
      }
    ]
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    role: 'UI Building',
    avatar: 'AG',
    status: 'Active',
    enabled: true,
    model: 'Antigravity UI',
    activeTask: 'Styling login card layouts',
    messages: [
      { sender: 'agent', text: "UI styling tokens configured. Matte military theme with lime highlights applied.", timestamp: '18:42' }
    ]
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    role: 'Agentic Coding',
    avatar: 'WS',
    status: 'Idle',
    enabled: true,
    model: 'Windsurf Agent',
    activeTask: 'Awaiting instruction',
    messages: [
      { sender: 'agent', text: "Agentic IDE session listening. Awaiting instructions for codebase automation.", timestamp: '18:30' }
    ]
  },
  {
    id: 'cursor',
    name: 'Cursor',
    role: 'Code Editor AI',
    avatar: 'CR',
    status: 'Active',
    enabled: true,
    model: 'Cursor Composer',
    activeTask: 'Managing repository imports',
    messages: [
      { sender: 'agent', text: "Composer logs synced. Zero imports compilation warnings detected.", timestamp: '18:25' }
    ]
  },
  {
    id: 'codex',
    name: 'Codex',
    role: 'Code Generation',
    avatar: 'CX',
    status: 'Idle',
    enabled: true,
    model: 'GPT-3.5 Codex',
    activeTask: 'Awaiting instruction',
    messages: [
      { sender: 'agent', text: "Legacy translation pipeline active. Ready to convert JS functions to TypeScript.", timestamp: '18:10' }
    ]
  },
  {
    id: 'stitch',
    name: 'Stitch',
    role: 'Design AI',
    avatar: 'ST',
    status: 'Active',
    enabled: true,
    model: 'Stitch Vision',
    activeTask: 'Structuring design layout systems',
    messages: [
      { sender: 'agent', text: "Design assets exported. Color palette ratios matching Geist Mono specifications verified.", timestamp: '18:05' }
    ]
  }
];
