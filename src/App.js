import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, createTask, updateTask, deleteTask } from './api/tasks';
import { Plus, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './App.css';

const STATUS_ICONS = {
  todo: <Clock size={16} color="#9ca3af" />,
  in_progress: <AlertCircle size={16} color="#60a5fa" />,
  done: <CheckCircle size={16} color="#34d399" />,
};

const PRIORITY_COLORS = {
  low:    { background: '#f3f4f6', color: '#4b5563' },
  medium: { background: '#fef9c3', color: '#854d0e' },
  high:   { background: '#fee2e2', color: '#991b1b' },
};

function TaskCard({ task, onStatusChange, onDelete }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '12px',
      padding: '16px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      borderLeft: `4px solid ${task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#6b7280'}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {STATUS_ICONS[task.status]}
        <h3 style={{ margin: 0, flex: 1, fontSize: '15px', fontWeight: 600 }}>{task.title}</h3>
        <button onClick={() => onDelete(task.id)} style={{
          background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px'
        }}>
          <Trash2 size={15} />
        </button>
      </div>
      {task.description && (
        <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>{task.description}</p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px',
          ...PRIORITY_COLORS[task.priority]
        }}>
          {task.priority}
        </span>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          style={{
            fontSize: '12px', border: '1px solid #e5e7eb', borderRadius: '6px',
            padding: '2px 6px', cursor: 'pointer', background: 'white'
          }}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
      </div>
    </div>
  );
}

function AddTaskForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' });

  const handleSubmit = async () => {
    if (!form.title.trim()) return;
    await onAdd(form);
    setForm({ title: '', description: '', priority: 'medium' });
    setOpen(false);
  };

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{
      display: 'flex', alignItems: 'center', gap: '8px',
      background: '#6366f1', color: 'white', border: 'none',
      borderRadius: '10px', padding: '10px 20px', fontSize: '14px',
      fontWeight: 600, cursor: 'pointer', marginBottom: '20px'
    }}>
      <Plus size={18} /> Add Task
    </button>
  );

  return (
    <div style={{
      background: 'white', borderRadius: '12px', padding: '20px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px',
      display: 'flex', flexDirection: 'column', gap: '12px'
    }}>
      <input
        placeholder="Task title *"
        value={form.title}
        onChange={e => setForm({ ...form, title: e.target.value })}
        style={{
          padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb',
          fontSize: '14px', outline: 'none'
        }}
      />
      <textarea
        placeholder="Description (optional)"
        value={form.description}
        onChange={e => setForm({ ...form, description: e.target.value })}
        style={{
          padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb',
          fontSize: '14px', outline: 'none', resize: 'vertical', minHeight: '80px'
        }}
      />
      <select
        value={form.priority}
        onChange={e => setForm({ ...form, priority: e.target.value })}
        style={{
          padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb',
          fontSize: '14px', background: 'white'
        }}
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button onClick={() => setOpen(false)} style={{
          flex: 1, padding: '10px', borderRadius: '8px',
          border: '1px solid #e5e7eb', background: 'white',
          fontSize: '14px', cursor: 'pointer'
        }}>Cancel</button>
        <button onClick={handleSubmit} style={{
          flex: 1, padding: '10px', borderRadius: '8px',
          border: 'none', background: '#6366f1', color: 'white',
          fontSize: '14px', fontWeight: 600, cursor: 'pointer'
        }}>Create Task</button>
      </div>
    </div>
  );
}

export default function App() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => fetchTasks(filter !== 'all' ? { status: filter } : {}),
  });

const addMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task created! 🎯');
    },
    onError: () => toast.error('Failed to create task'),
  });

const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task updated! ✏️');
    },
    onError: () => toast.error('Failed to update task'),
  });

const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task deleted 🗑️');
    },
    onError: () => toast.error('Failed to delete task'),
  });

  const filters = ['all', 'todo', 'in_progress', 'done'];
  const counts = {
    all: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        padding: '24px 32px', color: 'white'
      }}>
<div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 800 }}>☁️ CloudTask</h1>
          <p style={{ margin: '4px 0 16px', opacity: 0.85, fontSize: '14px' }}>
            Serverless task manager · Built on AWS
          </p>

          {/* AWS Service Badges */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {['S3', 'Lambda', 'RDS', 'API Gateway', 'VPC'].map(s => (
              <span key={s} style={{
                background: 'rgba(255,255,255,0.2)', borderRadius: '999px',
                padding: '3px 12px', fontSize: '12px', fontWeight: 600
              }}>{s}</span>
            ))}
          </div>

          {/* Stats Bar */}
          <div style={{
            display: 'flex', gap: '12px', flexWrap: 'wrap'
          }}>
            {[
              { label: 'Total Tasks',  value: counts.all,         emoji: '📋', bg: 'rgba(255,255,255,0.15)' },
              { label: 'To Do',        value: counts.todo,        emoji: '⏰', bg: 'rgba(255,255,255,0.15)' },
              { label: 'In Progress',  value: counts.in_progress, emoji: '⚡', bg: 'rgba(255,255,255,0.15)' },
              { label: 'Done',         value: counts.done,        emoji: '✅', bg: 'rgba(255,255,255,0.15)' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: stat.bg,
                borderRadius: '12px',
                padding: '10px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                minWidth: '110px'
              }}>
                <span style={{ fontSize: '20px' }}>{stat.emoji}</span>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1 }}>{stat.value}</div>
                  <div style={{ fontSize: '11px', opacity: 0.85, marginTop: '2px' }}>{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 16px' }}>
        {/* Filter Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 16px', borderRadius: '999px', fontSize: '13px',
                fontWeight: 600, cursor: 'pointer', border: 'none',
                background: filter === f ? '#6366f1' : 'white',
                color: filter === f ? 'white' : '#6b7280',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              {f.replace('_', ' ')} ({counts[f] || 0})
            </button>
          ))}
        </div>

        {/* Add Task */}
        <AddTaskForm onAdd={(data) => addMutation.mutate(data)} />

        {/* Tasks Grid */}
        {isLoading ? (
          <div style={{ textAlign: 'center', color: '#6b7280', padding: '40px' }}>
            Loading tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div style={{
            textAlign: 'center', color: '#9ca3af', padding: '60px',
            background: 'white', borderRadius: '12px'
          }}>
            No tasks yet — add one above! 🎯
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px'
          }}>
            {tasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={(id, status) => {
                  const t = tasks.find(t => t.id === id);
                  updateMutation.mutate({ id, ...t, status });
                }}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}