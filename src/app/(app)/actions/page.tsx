'use client';
import { useAppState } from '@/lib/store';
import { CheckSquare, Circle, Clock, AlertTriangle, Play, CheckCircle2, XCircle } from 'lucide-react';

const priorityColors: Record<string, string> = {
  critical: 'bg-red-500/10 border-red-500/20 text-red-400',
  high: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  medium: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  low: 'bg-[#1E293B] border-[#334155] text-[#64748B]',
};
const statusIcons: Record<string, React.ElementType> = {
  'pending': Circle, 'in-progress': Play, 'completed': CheckCircle2, 'blocked': XCircle,
};

export default function ActionsPage() {
  const { tasks, updateTaskStatus } = useAppState();

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <CheckSquare className="w-12 h-12 text-[#475569] mb-4" />
        <h2 className="text-xl font-bold text-[#F1F5F9] mb-2">No Action Items</h2>
        <p className="text-[#94A3B8]">Action items will be generated from tender analysis.</p>
      </div>
    );
  }

  const groups = [
    { label: 'Critical', items: tasks.filter(t => t.priority === 'critical'), color: 'text-red-400' },
    { label: 'High Priority', items: tasks.filter(t => t.priority === 'high'), color: 'text-amber-400' },
    { label: 'Medium Priority', items: tasks.filter(t => t.priority === 'medium'), color: 'text-blue-400' },
    { label: 'Low Priority', items: tasks.filter(t => t.priority === 'low'), color: 'text-[#64748B]' },
  ];

  return (
    <div className="space-y-8" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      <div>
        <h1 className="text-2xl font-bold text-[#F1F5F9]">Submission Action Plan</h1>
        <p className="text-sm text-[#64748B] mt-1">{tasks.length} tasks · {tasks.filter(t => t.status === 'completed').length} completed</p>
      </div>

      {groups.filter(g => g.items.length > 0).map(group => (
        <div key={group.label}>
          <h2 className={`text-xs font-semibold uppercase tracking-wider mb-3 ${group.color}`}>{group.label}</h2>
          <div className="space-y-2">
            {group.items.map((task, i) => {
              const StatusIcon = statusIcons[task.status];
              return (
                <div key={task.id} className="bg-[#141B2D] border border-[#1E293B] rounded-xl p-4 flex items-start gap-4 hover:border-[#334155] transition-all" style={{ animation: `fade-in-up 0.3s ease-out ${i * 0.05}s both` }}>
                  <button
                    onClick={() => updateTaskStatus(task.id, task.status === 'completed' ? 'pending' : task.status === 'pending' ? 'in-progress' : 'completed')}
                    className={`mt-0.5 p-1 rounded-lg transition-colors ${task.status === 'completed' ? 'text-emerald-400' : 'text-[#475569] hover:text-[#94A3B8]'}`}
                  >
                    <StatusIcon className="w-5 h-5" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-[#64748B] line-through' : 'text-[#F1F5F9]'}`}>{task.title}</p>
                    <p className="text-xs text-[#64748B] mt-0.5">{task.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-[#64748B]">
                      <span>Owner: <span className="text-[#94A3B8]">{task.owner}</span></span>
                      <span>Due: <span className={task.dueDate <= new Date().toISOString().split('T')[0] ? 'text-red-400' : 'text-[#94A3B8]'}>{new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span></span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${priorityColors[task.priority]}`}>{task.priority}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
