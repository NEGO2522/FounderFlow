import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactFlow, { 
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position
} from 'reactflow';
import 'reactflow/dist/style.css';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { supabase } from '../lib/supabase';
import heroImage from '../assets/hero.png';
import '../styles/setup.css';

const defaultAgents = [
  { id: 'chatgpt', name: 'ChatGPT', role: 'Marketing & Growth', avatar: 'GP' },
  { id: 'claude', name: 'Claude', role: 'Strategy & Docs', avatar: 'CL' },
  { id: 'gemini', name: 'Gemini', role: 'Research & Analysis', avatar: 'GM' },
  { id: 'perplexity', name: 'Perplexity', role: 'Market Intelligence', avatar: 'PX' },
  { id: 'deepseek', name: 'DeepSeek', role: 'Backend Development', avatar: 'DS' },
  { id: 'antigravity', name: 'Antigravity', role: 'UI/UX Building', avatar: 'AG' },
  { id: 'windsurf', name: 'Windsurf', role: 'Full Stack Execution', avatar: 'WS' },
  { id: 'cursor', name: 'Cursor', role: 'Code Review & Debug', avatar: 'CR' },
  { id: 'codex', name: 'Codex', role: 'Code Generation', avatar: 'CX' },
  { id: 'stitch', name: 'Stitch', role: 'Design System', avatar: 'ST' }
];

const loadingPhrases = [
  "Reading your idea...",
  "Figuring out what to build...",
  "Giving each AI a job...",
  "Setting up your team...",
  "Almost done..."
];

const launchPhrases = [
  "Saving everything...",
  "Setting up your AIs...",
  "Getting your workspace ready...",
  "Almost done..."
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CUSTOM REACTFLOW NODE TYPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// IdeaNode (START):
// - Round circle, 120px
// - Border: 2px solid #C8F04A
// - Background: #0F1109
// - Center text: "YOUR IDEA" lime 10px
// - Below: first 5 words of idea, muted 9px
// - Lime glow: box-shadow 0 0 20px rgba(200,240,74,0.2)
// IdeaNode (START):
// - Rectangle card layout
// - Border: 2px solid #C8F04A
// - Background: #12150D
// - Padding: 16px
// - Width: 240px
// - Height: auto (adjusts to content)
// - Lime glow: box-shadow 0 0 20px rgba(200,240,74,0.15)
// IdeaNode (START):
// - Round circle layout
// - Border: 2px solid #C8F04A
// - Background: #0F1109
// - Text: "YOUR IDEA" lime 9px bold centered
// - Lime glow effect
// - Do NOT show idea text inside circle
// - Below circle (outside): show first 4 words of idea in muted 9px text
const IdeaNode = ({ data }) => {
  return (
    <div className="reactflow-idea-node" style={data.style}>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <div className="reactflow-idea-node-circle">
        <span className="reactflow-idea-node-title">YOUR IDEA</span>
      </div>
      <div className="reactflow-idea-node-preview">
        {data.preview}
      </div>
    </div>
  );
};

// AgentNode (10 agents):
// - Width: 200px, height: 70px
// - Background: #12150D
// - Border: 1px solid #2E3320
// - Border-left: 3px solid #C8F04A
// - Left: avatar circle (initials, 32px, border 1px #2E3320, color #9AA066)
// - Right: name bold white 13px + role muted 11px (EDITABLE on double click)
// - On select: border all sides #C8F04A
// - Drag handle: show grab cursor
const AgentNode = ({ data }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempRole, setTempRole] = useState(data.role);

  useEffect(() => {
    setTempRole(data.role);
  }, [data.role]);

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      data.onRoleChange(data.id, tempRole);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    data.onRoleChange(data.id, tempRole);
  };

  const displayRole = data.tasks && data.tasks.length > 0 ? data.tasks[0] : data.role;
  const moreCount = data.tasks && data.tasks.length > 1 ? data.tasks.length - 1 : 0;

  return (
    <div className="reactflow-agent-node" style={data.style}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="reactflow-agent-avatar">
        {data.avatar}
      </div>
      <div className="reactflow-agent-info" onDoubleClick={handleDoubleClick}>
        <div className="reactflow-agent-name">{data.name}</div>
        {isEditing ? (
          <input
            type="text"
            className="reactflow-agent-role-input"
            value={tempRole}
            onChange={(e) => setTempRole(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="reactflow-agent-role-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div className="reactflow-agent-role">{displayRole}</div>
            {moreCount > 0 && (
              <span className="reactflow-agent-more-badge">+{moreCount} more</span>
            )}
          </div>
        )}
      </div>
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </div>
  );
};

// LaunchNode (END):
// - Round circle, 120px
// - Border: 2px solid #C8F04A
// - Background: #0F1109
// - Text: "LAUNCH" lime bold
// - Subtitle: "V1 ready" muted 9px
// - Same lime glow as IdeaNode
const LaunchNode = ({ data }) => {
  return (
    <div className="reactflow-launch-node" style={data.style}>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="reactflow-launch-node-circle">
        <span className="reactflow-launch-node-title">LAUNCH</span>
      </div>
      <div className="reactflow-launch-node-desc">
        V1 ready
      </div>
    </div>
  );
};

const nodeTypes = {
  idea: IdeaNode,
  agent: AgentNode,
  launch: LaunchNode
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DRAG AND DROP UTILITIES FOR CUSTOMIZE WORKFLOW
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const DraggableTaskChip = ({ agentId, task, index, onRemove }) => {
  const uniqueChipId = `${agentId}:${index}:${task}`;
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: uniqueChipId
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1000
  } : undefined;

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`sheet-task-pill ${isDragging ? 'dragging' : ''}`}
      {...attributes} 
      {...listeners}
    >
      <span>{task}</span>
      <button 
        className="sheet-remove-task-btn" 
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        ×
      </button>
    </div>
  );
};

const DroppableAgentRow = ({ 
  agent, 
  activeInputAgentId, 
  setActiveInputAgentId, 
  taskInputValue, 
  setTaskInputValue, 
  handleTaskInputKeyDown, 
  handleTaskInputBlur, 
  handleRemoveTask 
}) => {
  const { setNodeRef, isOver } = useDroppable({ 
    id: agent.id 
  });

  return (
    <div 
      ref={setNodeRef} 
      className={`sheet-agent-row ${isOver ? 'drag-over' : ''}`}
    >
      <div className="sheet-agent-left">
        <div className="sheet-agent-avatar">
          {agent.avatar}
        </div>
        <div className="sheet-agent-name">
          {agent.name}
        </div>
      </div>
      
      <div className="sheet-agent-tasks-section">
        <div className="sheet-tasks-list">
          {agent.tasks && agent.tasks.map((task, index) => (
            <DraggableTaskChip
              key={`${agent.id}-${index}-${task}`}
              agentId={agent.id}
              task={task}
              index={index}
              onRemove={() => handleRemoveTask(agent.id, index)}
            />
          ))}
          
          {activeInputAgentId === agent.id ? (
            <input
              type="text"
              className="sheet-inline-task-input"
              value={taskInputValue}
              onChange={(e) => setTaskInputValue(e.target.value)}
              onKeyDown={(e) => handleTaskInputKeyDown(e, agent.id)}
              onBlur={() => handleTaskInputBlur(agent.id)}
              placeholder="Add task & hit Enter..."
              autoFocus
            />
          ) : (
            <button 
              className="sheet-add-task-pill-btn"
              onClick={() => {
                setActiveInputAgentId(agent.id);
                setTaskInputValue('');
              }}
            >
              + Add Task
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProjectSetupPage({ saveProject, saveTasks, saveAgents, onProjectLaunch, freshStart }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(() => {
    return sessionStorage.getItem('ff_setup_step') || 'input';
  });
  const [ideaText, setIdeaText] = useState(() => {
    return sessionStorage.getItem('ff_setup_idea') || '';
  });

  useEffect(() => {
    if (freshStart) {
      sessionStorage.removeItem('ff_setup_step');
      sessionStorage.removeItem('ff_setup_idea');
      setStep('input');
      setIdeaText('');
      setNodes([]);
      setEdges([]);
    }
  }, [freshStart]);

  const savedNodesRef = useRef([]);
  const savedAgentsRef = useRef([]);

  const updateStep = (newStep) => {
    sessionStorage.setItem('ff_setup_step', newStep);
    setStep(newStep);
  };

  const handleIdeaChange = (e) => {
    const val = e.target.value;
    setIdeaText(val);
    sessionStorage.setItem('ff_setup_idea', val);
  };

  const [agentsList, setAgentsList] = useState(() => 
    defaultAgents.map(a => ({ ...a, tasks: [a.role] }))
  );
  const agentsListRef = useRef(agentsList);

  useEffect(() => {
    agentsListRef.current = agentsList;
  }, [agentsList]);

  const [selectedAgent, setSelectedAgent] = useState(null);
  const [editingRole, setEditingRole] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [localAgents, setLocalAgents] = useState([]);
  const [activeInputAgentId, setActiveInputAgentId] = useState(null);
  const [taskInputValue, setTaskInputValue] = useState('');

  // Loading phase states
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // ReactFlow Specific state hooks
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Staggered Position generators
  const getInitialNodes = (agents, previewText) => {
    return [
      {
        id: 'idea',
        type: 'idea',
        position: { x: 50, y: 250 },
        data: { preview: previewText, style: { animationDelay: '0ms' } }
      },
      // Left Column (x: 250)
      {
        id: 'chatgpt',
        type: 'agent',
        position: { x: 250, y: 30 },
        data: { id: 'chatgpt', name: 'ChatGPT', role: agents.find(a => a.id === 'chatgpt')?.role || '', tasks: agents.find(a => a.id === 'chatgpt')?.tasks || [], avatar: 'GP', onRoleChange: handleRoleChange, style: { animationDelay: '100ms' } }
      },
      {
        id: 'gemini',
        type: 'agent',
        position: { x: 250, y: 130 },
        data: { id: 'gemini', name: 'Gemini', role: agents.find(a => a.id === 'gemini')?.role || '', tasks: agents.find(a => a.id === 'gemini')?.tasks || [], avatar: 'GM', onRoleChange: handleRoleChange, style: { animationDelay: '200ms' } }
      },
      {
        id: 'deepseek',
        type: 'agent',
        position: { x: 250, y: 230 },
        data: { id: 'deepseek', name: 'DeepSeek', role: agents.find(a => a.id === 'deepseek')?.role || '', tasks: agents.find(a => a.id === 'deepseek')?.tasks || [], avatar: 'DS', onRoleChange: handleRoleChange, style: { animationDelay: '300ms' } }
      },
      {
        id: 'windsurf',
        type: 'agent',
        position: { x: 250, y: 330 },
        data: { id: 'windsurf', name: 'Windsurf', role: agents.find(a => a.id === 'windsurf')?.role || '', tasks: agents.find(a => a.id === 'windsurf')?.tasks || [], avatar: 'WS', onRoleChange: handleRoleChange, style: { animationDelay: '400ms' } }
      },
      {
        id: 'codex',
        type: 'agent',
        position: { x: 250, y: 430 },
        data: { id: 'codex', name: 'Codex', role: agents.find(a => a.id === 'codex')?.role || '', tasks: agents.find(a => a.id === 'codex')?.tasks || [], avatar: 'CX', onRoleChange: handleRoleChange, style: { animationDelay: '500ms' } }
      },
      // Right Column (x: 470)
      {
        id: 'claude',
        type: 'agent',
        position: { x: 470, y: 30 },
        data: { id: 'claude', name: 'Claude', role: agents.find(a => a.id === 'claude')?.role || '', tasks: agents.find(a => a.id === 'claude')?.tasks || [], avatar: 'CL', onRoleChange: handleRoleChange, style: { animationDelay: '600ms' } }
      },
      {
        id: 'perplexity',
        type: 'agent',
        position: { x: 470, y: 130 },
        data: { id: 'perplexity', name: 'Perplexity', role: agents.find(a => a.id === 'perplexity')?.role || '', tasks: agents.find(a => a.id === 'perplexity')?.tasks || [], avatar: 'PX', onRoleChange: handleRoleChange, style: { animationDelay: '700ms' } }
      },
      {
        id: 'antigravity',
        type: 'agent',
        position: { x: 470, y: 230 },
        data: { id: 'antigravity', name: 'Antigravity', role: agents.find(a => a.id === 'antigravity')?.role || '', tasks: agents.find(a => a.id === 'antigravity')?.tasks || [], avatar: 'AG', onRoleChange: handleRoleChange, style: { animationDelay: '800ms' } }
      },
      {
        id: 'cursor',
        type: 'agent',
        position: { x: 470, y: 330 },
        data: { id: 'cursor', name: 'Cursor', role: agents.find(a => a.id === 'cursor')?.role || '', tasks: agents.find(a => a.id === 'cursor')?.tasks || [], avatar: 'CR', onRoleChange: handleRoleChange, style: { animationDelay: '900ms' } }
      },
      {
        id: 'stitch',
        type: 'agent',
        position: { x: 470, y: 430 },
        data: { id: 'stitch', name: 'Stitch', role: agents.find(a => a.id === 'stitch')?.role || '', tasks: agents.find(a => a.id === 'stitch')?.tasks || [], avatar: 'ST', onRoleChange: handleRoleChange, style: { animationDelay: '1000ms' } }
      },
      // Launch node
      {
        id: 'launch',
        type: 'launch',
        position: { x: 700, y: 250 },
        data: { style: { animationDelay: '1200ms' } }
      }
    ];
  };

  const handleRoleChange = (agentId, newRole) => {
    setAgentsList(prev => prev.map(a => {
      if (a.id === agentId) {
        const updatedTasks = [...(a.tasks || [])];
        if (updatedTasks.length > 0) {
          updatedTasks[0] = newRole;
        } else {
          updatedTasks.push(newRole);
        }
        return { ...a, role: newRole, tasks: updatedTasks };
      }
      return a;
    }));

    setNodes(prevNodes => prevNodes.map(node => {
      if (node.id === agentId) {
        const updatedTasks = [...(node.data.tasks || [])];
        if (updatedTasks.length > 0) {
          updatedTasks[0] = newRole;
        } else {
          updatedTasks.push(newRole);
        }
        return {
          ...node,
          data: {
            ...node.data,
            role: newRole,
            tasks: updatedTasks
          }
        };
      }
      return node;
    }));
  };

  // Populate ReactFlow elements on state transition
  useEffect(() => {
    if (step === 'workflow' && nodes.length === 0) {
      const words = ideaText.trim().split(/\s+/);
      const previewText = words.slice(0, 4).join(' ') + (words.length > 4 ? '...' : '');
      setNodes(getInitialNodes(agentsList, previewText));

      const edgesSetup = [];
      agentsList.forEach(a => {
        // Idea -> Agent
        edgesSetup.push({
          id: `e-idea-${a.id}`,
          source: 'idea',
          target: a.id,
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#C8F04A', strokeWidth: 1.5, opacity: 0.4 }
        });
        // Agent -> Launch
        edgesSetup.push({
          id: `e-${a.id}-launch`,
          source: a.id,
          target: 'launch',
          type: 'smoothstep',
          animated: false,
          markerEnd: { type: MarkerType.ArrowClosed, color: '#C8F04A' },
          style: { stroke: '#C8F04A', strokeWidth: 1.5, opacity: 0.4 }
        });
      });
      setEdges(edgesSetup);
    }
  }, [step]);

  // Loading Screen Interval
  useEffect(() => {
    if (step === 'loading' || step === 'loading-launch') {
      setProgress(0);
      setPhraseIndex(0);

      const duration = step === 'loading' ? 4000 : 3000;
      const intervalTime = 800;
      const stepsCount = duration / 50;

      const phraseInterval = setInterval(() => {
        setPhraseIndex(prev => {
          const limit = step === 'loading' ? loadingPhrases.length : launchPhrases.length;
          return (prev + 1) % limit;
        });
      }, intervalTime);

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + (100 / stepsCount);
        });
      }, 50);

      const timeout = setTimeout(() => {
        clearInterval(phraseInterval);
        clearInterval(progressInterval);
        if (step === 'loading') {
          updateStep('workflow');
        } else {
          executeLaunch();
        }
      }, duration);

      return () => {
        clearInterval(phraseInterval);
        clearInterval(progressInterval);
        clearTimeout(timeout);
      };
    }
  }, [step]);

  const handleSaveRole = () => {
    if (!selectedAgent) return;
    handleRoleChange(selectedAgent.id, editingRole);
    setSelectedAgent(null);
  };

  const handleReset = () => {
    setAgentsList(defaultAgents.map(a => ({ ...a, tasks: [a.role] })));
    setSelectedAgent(null);
    sessionStorage.removeItem('ff_setup_step');
    sessionStorage.removeItem('ff_setup_idea');
    updateStep('input');
    setIdeaText('');
    setNodes([]);
    setEdges([]);
  };

  const handleResetLayout = () => {
    const words = ideaText.trim().split(/\s+/);
    const previewText = words.slice(0, 4).join(' ') + (words.length > 4 ? '...' : '');
    setNodes(getInitialNodes(agentsList, previewText));
  };

  useEffect(() => {
    if (sheetOpen) {
      setLocalAgents(agentsList.map(a => ({
        ...a,
        tasks: a.tasks ? [...a.tasks] : [a.role]
      })));
    }
  }, [sheetOpen, agentsList]);

  const handleRemoveTask = (agentId, index) => {
    setLocalAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        const updated = a.tasks.filter((_, idx) => idx !== index);
        return { ...a, tasks: updated };
      }
      return a;
    }));
  };

  const handleAddTask = (agentId, taskName) => {
    const trimmed = taskName.trim();
    if (!trimmed) return;
    setLocalAgents(prev => prev.map(a => {
      if (a.id === agentId) {
        if (a.tasks.includes(trimmed)) return a;
        return { ...a, tasks: [...a.tasks, trimmed] };
      }
      return a;
    }));
  };

  const handleTaskInputKeyDown = (e, agentId) => {
    if (e.key === 'Enter') {
      handleAddTask(agentId, taskInputValue);
      setTaskInputValue('');
      setActiveInputAgentId(null);
    } else if (e.key === 'Escape') {
      setActiveInputAgentId(null);
    }
  };

  const handleTaskInputBlur = (agentId) => {
    if (taskInputValue.trim()) {
      handleAddTask(agentId, taskInputValue);
    }
    setActiveInputAgentId(null);
    setTaskInputValue('');
  };

  const handleResetToDefault = () => {
    setLocalAgents(defaultAgents.map(a => ({
      ...a,
      tasks: [a.role]
    })));
  };

  const handleSaveAndClose = () => {
    setAgentsList(localAgents);
    agentsListRef.current = localAgents;
    setNodes(prevNodes => prevNodes.map(node => {
      const match = localAgents.find(a => a.id === node.id);
      if (match) {
        const mainRole = match.tasks && match.tasks.length > 0 ? match.tasks[0] : match.role;
        return {
          ...node,
          data: {
            ...node.data,
            role: mainRole,
            tasks: match.tasks
          }
        };
      }
      return node;
    }));
    setSheetOpen(false);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = String(active.id);
    const targetAgentId = String(over.id);

    const parts = activeIdStr.split(':');
    if (parts.length < 3) return;

    const sourceAgentId = parts[0];
    const taskIndex = parseInt(parts[1], 10);
    const taskText = parts.slice(2).join(':');

    if (sourceAgentId === targetAgentId) {
      return;
    }

    setLocalAgents(prev => prev.map(a => {
      if (a.id === sourceAgentId) {
        const updatedTasks = a.tasks.filter((_, idx) => idx !== taskIndex);
        return { ...a, tasks: updatedTasks };
      }
      if (a.id === targetAgentId) {
        if (a.tasks.includes(taskText)) return a;
        return { ...a, tasks: [...a.tasks, taskText] };
      }
      return a;
    }));
  };

  const detectStack = (idea) => {
    const stacks = []
    if (/app|mobile/i.test(idea)) 
      stacks.push('React Native')
    if (/web|website|dashboard/i.test(idea)) 
      stacks.push('React')
    if (/api|backend|server/i.test(idea)) 
      stacks.push('Node.js')
    if (/database|data/i.test(idea)) 
      stacks.push('PostgreSQL')
    if (/delivery|real.?time/i.test(idea)) 
      stacks.push('Redis')
    if (/ai|ml|model/i.test(idea)) 
      stacks.push('Python')
    return stacks.length > 0 
      ? stacks.join(', ') 
      : 'React, Node.js, PostgreSQL'
  }

  const handleConfirmAndLaunch = async () => {
    try {
      // 1. Get current Supabase user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Save current agents configuration to ref BEFORE step transition unmounts ReactFlow
      savedNodesRef.current = agentsListRef.current.map(a => ({
        id: a.avatar || a.id,
        name: a.name,
        role: a.tasks && a.tasks.length > 0 
          ? a.tasks[0] : a.role,
        tasks: a.tasks || [a.role],
        avatar: a.avatar || a.id.slice(0,2).toUpperCase()
      }));

      savedAgentsRef.current = agentsListRef.current;
      console.log('Saving agents:', savedNodesRef.current);

      // 2. Show loading step (3 seconds)
      updateStep('loading-launch');

      // 3. Generate project name from idea
      const projectId = ideaText
        .trim()
        .split(' ')
        .slice(0, 5)
        .join('-')
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '');

      const projectName = ideaText
        .trim()
        .split(' ')
        .slice(0, 6)
        .join(' ');

      // 4. Save project to Supabase
      const { error: projectError } = await supabase
        .from('projects')
        .upsert({
          id: projectId,
          user_id: user.id,
          name: projectName,
          status: 'ACTIVE',
          stack: detectStack(ideaText),
          agents: savedNodesRef.current.map(n => n.avatar),
          idea_text: ideaText
        });

      if (projectError) {
        console.error('Project save error:', projectError);
        return;
      }

      // 5. Save agents with their roles to Supabase
      const agentRows = savedNodesRef.current.map(n => ({
        id: n.avatar,
        user_id: user.id,
        name: n.name,
        role: n.role,
        avatar: n.avatar,
        enabled: true,
        model: 'claude-sonnet-4-6',
        active_task: n.tasks ? n.tasks.join(', ') : n.role
      }));

      await supabase
        .from('agents')
        .upsert(agentRows);

      // 6. Save idea text separately in profiles
      await supabase
        .from('profiles')
        .update({ 
          current_project_id: projectId,
          last_idea: ideaText 
        })
        .eq('id', user.id);

      // 7. Clear sessionStorage
      sessionStorage.removeItem('ff_setup_step');
      sessionStorage.removeItem('ff_setup_idea');
    } catch (err) {
      console.error('Confirm & Launch transaction failed:', err);
    }
  };

  const executeLaunch = async () => {
    // Notify App state callbacks of launched project for responsive sync
    if (onProjectLaunch) {
      const projectId = ideaText
        .trim()
        .split(' ')
        .slice(0, 5)
        .join('-')
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '');

      const projectName = ideaText
        .trim()
        .split(' ')
        .slice(0, 6)
        .join(' ');

      const newProject = {
        id: projectId,
        name: projectName,
        status: 'ACTIVE',
        stack: 'TBD',
        agents: savedNodesRef.current.map(n => n.avatar),
        roadmap: [
          { id: 1, text: 'Initialize repository structure', completed: true },
          { id: 2, text: 'Configure agent workspace channels', completed: false },
          { id: 3, text: 'Establish real-time data sync', completed: false }
        ]
      };

      const configuredAgents = savedNodesRef.current.map(n => ({
        id: n.avatar,
        name: n.name,
        role: n.role,
        tasks: n.tasks || [n.role],
        avatar: n.avatar,
        enabled: true,
        model: 'claude-sonnet-4-6',
        activeTask: n.tasks ? n.tasks.join(', ') : n.role
      }));

      onProjectLaunch(newProject, configuredAgents);
    }

    navigate('/dashboard');
  };

  const getIdeaPreview = () => {
    const words = ideaText.trim().split(/\s+/);
    if (words.length <= 6) return ideaText;
    return words.slice(0, 6).join(' ') + '...';
  };

  const onNodeClick = (event, node) => {
    if (node.type === 'agent') {
      const agent = agentsList.find(a => a.id === node.id);
      if (agent) {
        setSelectedAgent(agent);
        setEditingRole(agent.role);
      }
    } else {
      setSelectedAgent(null);
    }
  };

  return (
    <div className="setup-container">
      <div className="noise-overlay"></div>

      {/* Step 1: Input */}
      {step === 'input' && (
        <div className="setup-split-layout">
          <div className="setup-left-col">
            <div className="setup-logo-row">
              <div 
                className="setup-logo-small"
                onClick={() => navigate('/dashboard')}
                style={{ cursor: 'pointer' }}
              >
                FOUNDER<span>//</span>FLOW
              </div>
              <div className="setup-logo-divider"></div>
            </div>

            <div className="setup-left-middle">
              <span className="setup-input-badge">● NEW PROJECT</span>
              <h1 className="setup-input-title">What are you building?</h1>
              <p className="setup-input-subtext">
                Tell us your idea. Hindi, English, Hinglish — anything works.
              </p>

              <textarea
                className="setup-textarea-redesign"
                maxLength={500}
                placeholder="Mujhe ek hyperlocal grocery app banana hai jo 10 minutes me deliver kare..."
                value={ideaText}
                onChange={handleIdeaChange}
              />

              <div className="setup-input-action-row">
                <span className="setup-char-count-muted">
                  {ideaText.length}/500
                </span>
                <button
                  className="setup-btn-lime"
                  disabled={ideaText.trim().length < 20}
                  onClick={() => updateStep('loading')}
                >
                  Analyze My Idea →
                </button>
              </div>
            </div>
          </div>

          <div className="setup-right-col">
            <div>
              <span className="setup-right-title">WHAT WILL HAPPEN</span>
              <div className="setup-steps-list">
                <div className="setup-step-card">
                  <div className="setup-step-num">01</div>
                  <div className="setup-step-content">
                    <span className="setup-step-title">We read your idea</span>
                    <p className="setup-step-desc">
                      FounderFlow reads what you wrote and figures out what needs to be built.
                    </p>
                  </div>
                </div>

                <div className="setup-step-card">
                  <div className="setup-step-num">02</div>
                  <div className="setup-step-content">
                    <span className="setup-step-title">We assign AI roles</span>
                    <p className="setup-step-desc">
                      Each AI gets a specific job based on your idea.
                    </p>
                  </div>
                </div>

                <div className="setup-step-card">
                  <div className="setup-step-num">03</div>
                  <div className="setup-step-content">
                    <span className="setup-step-title">You start building</span>
                    <p className="setup-step-desc">
                      Check the roles, change if you want, then launch. Your AI team starts working.
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center' }}>
                <img 
                  src={heroImage} 
                  alt="FounderFlow workflow mockup" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '340px', 
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 0 30px rgba(200,240,74,0.05))'
                  }} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Loading (Initial or Launching) */}
      {(step === 'loading' || step === 'loading-launch') && (
        <div className="loading-container">
          <div className="loading-text">
            {step === 'loading' ? loadingPhrases[phraseIndex] : launchPhrases[phraseIndex]}
            <span className="loading-cursor">|</span>
          </div>
          <div className="loading-progress-bg">
            <div 
              className="loading-progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Step 3: Workflow Visualization (ReactFlow Canvas) */}
      {step === 'workflow' && (
        <div className="workflow-layout-overhaul">
          {/* Floating Top Left Title */}
          <div style={{ position: 'absolute', top: '40px', left: '40px', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div 
              className="workflow-header-logo" 
              onClick={() => navigate('/dashboard')}
              style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '0.12em', color: '#E8EDD4', cursor: 'pointer' }}
            >
              FOUNDER<span>//</span>FLOW
            </div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#C8F04A', letterSpacing: '0.15em' }}>
              YOUR TEAM IS READY · 10 AIs
            </div>
          </div>

          {/* Fullscreen ReactFlow Canvas (Not draggable / pannable / zoomable) */}
          <main className="reactflow-wrapper-fullscreen" style={{ height: 'calc(100vh - 120px)' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              onNodeClick={onNodeClick}
              fitView
              fitViewOptions={{ padding: 0.15, maxZoom: 1.1 }}
              style={{ background: '#0F1109' }}
              nodesDraggable={false}
              nodesConnectable={false}
              elementsSelectable={true}
              panOnDrag={false}
              zoomOnDoubleClick={false}
              preventScrolling={true}
              defaultViewport={{ zoom: 1.1 }}
              minZoom={0.5}
              maxZoom={2}
            >
              <Background variant="dots" color="#1E2118" gap={20} />
            </ReactFlow>
          </main>

          {/* Fixed Floating Action Buttons in bottom-right corner */}
          <div style={{ position: 'fixed', bottom: '40px', right: '40px', zIndex: 100, display: 'flex', gap: '12px' }}>
            <button 
              className="reactflow-customize-btn-new"
              onClick={() => setSheetOpen(true)}
            >
              Customize Workflow
            </button>
            <button 
              className="reactflow-launch-btn-filled-new" 
              onClick={handleConfirmAndLaunch}
            >
              Confirm & Launch →
            </button>
          </div>

          {/* Customizer drawer panel fallback */}
          <div className={`customize-panel ${selectedAgent ? 'open' : ''}`}>
            <div className="customize-label">
              Editing: <span>{selectedAgent?.name}</span>
            </div>
            <div className="customize-input-row">
              <input
                type="text"
                className="customize-input"
                value={editingRole}
                onChange={(e) => setEditingRole(e.target.value)}
                placeholder="Assign role or task details..."
              />
              <button className="customize-add-btn" onClick={() => setEditingRole(prev => prev + ' & Task')}>
                + Add Another Task
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="customize-done-btn" onClick={handleSaveRole}>
                Done
              </button>
              <button className="customize-done-btn" style={{ background: 'transparent', border: '1px solid #2E3320', color: '#6B7155' }} onClick={() => setSelectedAgent(null)}>
                Cancel
              </button>
            </div>
          </div>

          {/* Customize Workflow Bottom Sheet */}
          <div className={`customize-workflow-sheet ${sheetOpen ? 'open' : ''}`}>
            <div className="sheet-header">
              <div className="sheet-header-left">
                <span className="sheet-label">Edit Your AI Team</span>
                <div className="sheet-subtext">Change what each AI does. Add more than one task if needed.</div>
              </div>
              <button className="sheet-close-btn" onClick={() => setSheetOpen(false)}>
                ✕ Close
              </button>
            </div>
            
            <DndContext onDragEnd={handleDragEnd}>
              <div className="sheet-content">
                {localAgents.map((agent) => (
                  <DroppableAgentRow
                    key={agent.id}
                    agent={agent}
                    activeInputAgentId={activeInputAgentId}
                    setActiveInputAgentId={setActiveInputAgentId}
                    taskInputValue={taskInputValue}
                    setTaskInputValue={setTaskInputValue}
                    handleTaskInputKeyDown={handleTaskInputKeyDown}
                    handleTaskInputBlur={handleTaskInputBlur}
                    handleRemoveTask={handleRemoveTask}
                  />
                ))}
              </div>
            </DndContext>
            
            <div className="sheet-footer">
              <button className="sheet-reset-btn" onClick={handleResetToDefault}>
                Reset to Original
              </button>
              <button className="sheet-save-btn" onClick={handleSaveAndClose}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
