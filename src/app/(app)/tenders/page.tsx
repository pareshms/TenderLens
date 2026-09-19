'use client';

import { useAppState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { FileText, Clock, ArrowRight, Plus, Shield, Upload, Trash2 } from 'lucide-react';

export default function TendersPage() {
  const { tenders, setActiveTender, deleteTender } = useAppState();
  const router = useRouter();

  if (tenders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <FileText className="w-12 h-12 text-[#475569] mb-4" />
        <h2 className="text-xl font-bold text-[#F1F5F9] mb-2">No Tenders Indexed</h2>
        <p className="text-[#94A3B8] mb-6">Upload your tender RFP document on the Dashboard to begin automated compliance & evidence extraction.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all"
        >
          <Upload className="w-4 h-4" /> Go to Upload Dashboard
        </button>
      </div>
    );
  }

  const riskColors: Record<string, string> = {
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    high: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  return (
    <div className="space-y-6" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F9]">Tender Portfolio</h1>
          <p className="text-sm text-[#64748B] mt-1">All active procurement opportunities and compliance readiness scores.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" /> Add New Tender
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tenders.map(t => (
          <div
            key={t.id}
            className="bg-[#141B2D] border border-[#1E293B] hover:border-indigo-500/30 rounded-2xl p-6 transition-all cursor-pointer group shadow-xl relative"
            onClick={() => { setActiveTender(t.id); router.push(`/tenders/${t.id}`); }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-[#64748B] px-2 py-0.5 bg-[#0F1525] rounded border border-[#1E293B]">
                  {t.tenderId}
                </span>
                <h3 className="text-base font-bold text-[#F1F5F9] mt-2 group-hover:text-indigo-400 transition-colors">
                  {t.title}
                </h3>
                <p className="text-xs text-[#94A3B8] mt-1">{t.organization}</p>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${riskColors[t.risk]}`}>
                {t.risk} Risk
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 my-4 p-3 bg-[#0A0E1A] rounded-xl border border-[#1E293B] text-center">
              <div>
                <p className="text-[10px] text-[#64748B] uppercase">Value</p>
                <p className="text-xs font-bold text-emerald-400 mt-0.5">{t.estimatedValue}</p>
              </div>
              <div>
                <p className="text-[10px] text-[#64748B] uppercase">Readiness</p>
                <p className="text-xs font-bold text-[#F1F5F9] mt-0.5">{t.readiness}%</p>
              </div>
              <div>
                <p className="text-[10px] text-[#64748B] uppercase">Deadline</p>
                <p className="text-xs font-bold text-[#F1F5F9] mt-0.5">{t.daysRemaining} days</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1E293B]">
              <span className="text-xs text-[#64748B]">{t.totalRequirements} Requirements Extracted</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); deleteTender(t.id); }}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-[#64748B] hover:text-red-400 transition-colors"
                  title="Delete tender"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-indigo-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                  Open Workspace <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
