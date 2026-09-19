'use client';
import { useAppState } from '@/lib/store';
import { Clock, CheckCircle2, AlertTriangle, Calendar, ChevronRight } from 'lucide-react';

export default function DeadlinesPage() {
  const { deadlines } = useAppState();
  const statusConfig: Record<string, { color: string; bg: string; border: string; dotColor: string }> = {
    past: { color: 'text-[#64748B]', bg: 'bg-[#1E293B]/30', border: 'border-[#1E293B]', dotColor: 'bg-[#475569]' },
    upcoming: { color: 'text-blue-400', bg: 'bg-blue-500/5', border: 'border-blue-500/15', dotColor: 'bg-blue-400' },
    imminent: { color: 'text-red-400', bg: 'bg-red-500/5', border: 'border-red-500/15', dotColor: 'bg-red-400 animate-pulse' },
    today: { color: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/15', dotColor: 'bg-amber-400 animate-pulse' },
  };

  if (deadlines.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Clock className="w-12 h-12 text-[#475569] mb-4" />
        <h2 className="text-xl font-bold text-[#F1F5F9] mb-2">No Deadlines</h2>
        <p className="text-[#94A3B8]">Deadlines will appear after tender analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      <div>
        <h1 className="text-2xl font-bold text-[#F1F5F9]">Submission Timeline</h1>
        <p className="text-sm text-[#64748B] mt-1">Key dates and milestones for tender submission</p>
      </div>

      <div className="relative pl-8">
        {/* Timeline line */}
        <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-[#1E293B]" />

        <div className="space-y-4">
          {deadlines.map((dl, i) => {
            const config = statusConfig[dl.status];
            return (
              <div key={dl.id} className="relative" style={{ animation: `fade-in-up 0.4s ease-out ${i * 0.06}s both` }}>
                {/* Dot */}
                <div className={`absolute -left-8 top-4 w-3.5 h-3.5 rounded-full border-2 border-[#0A0E1A] z-10 ${config.dotColor}`} />

                <div className={`${config.bg} border ${config.border} rounded-xl p-4 ml-2`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-semibold ${dl.status === 'past' ? 'text-[#64748B]' : 'text-[#F1F5F9]'}`}>{dl.title}</p>
                      <p className="text-xs text-[#64748B] mt-0.5 flex items-center gap-1.5">
                        <Calendar className="w-3 h-3" />
                        {new Date(dl.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-right">
                      {dl.status === 'past' && <span className="inline-flex items-center gap-1 text-xs text-[#64748B]"><CheckCircle2 className="w-3 h-3" /> Passed</span>}
                      {dl.status === 'imminent' && <span className="inline-flex items-center gap-1 text-xs text-red-400 font-semibold"><AlertTriangle className="w-3 h-3" /> 6 days left</span>}
                      {dl.status === 'upcoming' && <span className="text-xs text-blue-400">Upcoming</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
