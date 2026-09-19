'use client';
import { useAppState } from '@/lib/store';
import { Activity, Upload, Brain, ListChecks, Link, ShieldAlert, ClipboardList, CheckCircle, Play, XCircle, AlertTriangle, Award, Briefcase, Wrench, FileText, Gauge, ShieldCheck, Landmark, FilePlus, Tags } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  'upload': Upload, 'brain': Brain, 'list-checks': ListChecks, 'link': Link,
  'shield-alert': ShieldAlert, 'clipboard-list': ClipboardList, 'check-circle': CheckCircle,
  'play': Play, 'x-circle': XCircle, 'alert-triangle': AlertTriangle, 'award': Award,
  'briefcase': Briefcase, 'wrench': Wrench, 'file-plus': FilePlus, 'tags': Tags,
  'gauge': Gauge, 'shield-check': ShieldCheck, 'landmark': Landmark,
};
const actorColors: Record<string, string> = { system: 'text-[#64748B]', ai: 'text-indigo-400', user: 'text-emerald-400' };

export default function AuditPage() {
  const { auditLog } = useAppState();

  if (auditLog.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Activity className="w-12 h-12 text-[#475569] mb-4" />
        <h2 className="text-xl font-bold text-[#F1F5F9] mb-2">No Activity Yet</h2>
        <p className="text-[#94A3B8]">Activity will be recorded as you analyze tenders.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      <div>
        <h1 className="text-2xl font-bold text-[#F1F5F9]">Audit Log</h1>
        <p className="text-sm text-[#64748B] mt-1">{auditLog.length} events recorded</p>
      </div>

      <div className="relative pl-8">
        <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-[#1E293B]" />
        <div className="space-y-3">
          {auditLog.map((entry, i) => {
            const Icon = iconMap[entry.icon] || Activity;
            return (
              <div key={entry.id} className="relative" style={{ animation: `fade-in-up 0.3s ease-out ${i * 0.03}s both` }}>
                <div className="absolute -left-8 top-3 w-3.5 h-3.5 rounded-full bg-[#1A2238] border-2 border-[#1E293B] z-10 flex items-center justify-center">
                  <div className={`w-1.5 h-1.5 rounded-full ${entry.actor === 'ai' ? 'bg-indigo-400' : entry.actor === 'user' ? 'bg-emerald-400' : 'bg-[#475569]'}`} />
                </div>
                <div className="bg-[#141B2D] border border-[#1E293B] rounded-lg px-4 py-3 ml-2 hover:border-[#334155] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${actorColors[entry.actor]}`} />
                      <span className="text-sm font-medium text-[#F1F5F9]">{entry.action}</span>
                      <span className={`text-[10px] uppercase tracking-wider font-semibold ${actorColors[entry.actor]}`}>{entry.actor}</span>
                    </div>
                    <span className="text-xs text-[#475569] font-mono">
                      {new Date(entry.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] mt-1">{entry.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
