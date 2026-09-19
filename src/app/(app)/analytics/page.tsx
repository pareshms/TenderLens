'use client';
import { useAppState } from '@/lib/store';
import { BarChart3, FileText, CheckCircle2, Clock, AlertTriangle, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  const { tenders, requirements } = useAppState();
  const total = tenders.length;
  const totalReqs = requirements.length;
  const satisfied = requirements.filter(r => r.status === 'satisfied').length;
  const missing = requirements.filter(r => r.status === 'missing').length;
  const review = requirements.filter(r => r.status === 'review').length;
  const cats = ['eligibility','financial','technical','experience','legal','documentation','submission'] as const;

  return (
    <div className="space-y-8" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F9]">Procurement Analytics</h1>
          <p className="text-sm text-[#64748B] mt-1">Intelligence overview across your tender portfolio</p>
        </div>
        <span className="px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-semibold text-amber-400 uppercase tracking-wider">Demo Data</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Tenders Analyzed', value: total, icon: FileText, color: 'text-blue-400' },
          { label: 'Requirements Processed', value: totalReqs, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'Open Gaps', value: missing + review, icon: AlertTriangle, color: 'text-amber-400' },
          { label: 'Avg Analysis Time', value: '28s', icon: Clock, color: 'text-indigo-400' },
        ].map(k => (
          <div key={k.label} className="bg-[#141B2D] border border-[#1E293B] rounded-xl p-5">
            <k.icon className={`w-5 h-5 ${k.color} mb-3`} />
            <p className="text-2xl font-bold text-[#F1F5F9]">{k.value}</p>
            <p className="text-xs text-[#64748B] mt-1">{k.label}</p>
          </div>
        ))}
      </div>
      <div className="bg-[#141B2D] border border-[#1E293B] rounded-xl p-6">
        <h3 className="text-base font-semibold text-[#F1F5F9] mb-4 flex items-center gap-2"><BarChart3 className="w-4 h-4 text-indigo-400" /> Requirements by Category</h3>
        <div className="space-y-3">
          {cats.map(cat => {
            const count = requirements.filter(r => r.category === cat).length;
            const pct = totalReqs ? Math.round((count / totalReqs) * 100) : 0;
            return (
              <div key={cat} className="flex items-center gap-4">
                <span className="text-xs text-[#94A3B8] w-28 capitalize">{cat}</span>
                <div className="flex-1 h-2 bg-[#1E293B] rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-[#64748B] font-mono w-10 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-[#141B2D] border border-[#1E293B] rounded-xl p-6">
        <h3 className="text-base font-semibold text-[#F1F5F9] mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-emerald-400" /> Status Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-emerald-400">{satisfied}</p>
            <p className="text-xs text-[#64748B] mt-1">Satisfied</p>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-amber-400">{review}</p>
            <p className="text-xs text-[#64748B] mt-1">Review</p>
          </div>
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-red-400">{missing}</p>
            <p className="text-xs text-[#64748B] mt-1">Missing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
