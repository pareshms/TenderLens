'use client';
import { useAppState } from '@/lib/store';
import { useParams } from 'next/navigation';
import { AlertTriangle, XCircle, CheckCircle2, ArrowRight, Upload } from 'lucide-react';

export default function GapsPage() {
  const { requirements, simulateUpload } = useAppState();
  const critical = requirements.filter(r => r.status === 'missing' && r.mandatory);
  const warnings = requirements.filter(r => r.status === 'review');
  const complete = requirements.filter(r => r.status === 'satisfied');

  return (
    <div className="space-y-8" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      <div><h1 className="text-2xl font-bold text-[#F1F5F9]">Compliance Gap Center</h1><p className="text-sm text-[#64748B] mt-1">Identify and resolve compliance gaps before submission</p></div>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-5 text-center"><p className="text-3xl font-bold text-red-400">{critical.length}</p><p className="text-xs text-[#64748B] mt-1 uppercase tracking-wider">Critical</p></div>
        <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-5 text-center"><p className="text-3xl font-bold text-amber-400">{warnings.length}</p><p className="text-xs text-[#64748B] mt-1 uppercase tracking-wider">Warning</p></div>
        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-5 text-center"><p className="text-3xl font-bold text-emerald-400">{complete.length}</p><p className="text-xs text-[#64748B] mt-1 uppercase tracking-wider">Complete</p></div>
      </div>
      {critical.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-3">Critical Gaps — Mandatory Requirements Missing</h2>
          <div className="space-y-3">
            {critical.map(req => (
              <div key={req.id} className="bg-red-500/5 border border-red-500/15 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-[#F1F5F9]">{req.title}</h3>
                    <p className="text-xs text-[#94A3B8] mt-1">{req.description}</p>
                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                      <div className="bg-[#0A0E1A] rounded-lg p-3"><p className="text-[10px] text-[#475569] uppercase tracking-wider font-semibold mb-1">What&apos;s Missing</p><p className="text-xs text-[#94A3B8]">{req.aiExplanation}</p></div>
                      <div className="bg-[#0A0E1A] rounded-lg p-3"><p className="text-[10px] text-[#475569] uppercase tracking-wider font-semibold mb-1">Source</p><p className="text-xs text-[#94A3B8] font-mono">{req.clause} · Page {req.page}</p></div>
                    </div>
                    <button onClick={() => simulateUpload(req.id)} className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-all">
                      <Upload className="w-3 h-3" /> Upload Evidence
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {warnings.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-3">Warnings — Needs Human Review</h2>
          <div className="space-y-2">
            {warnings.map(req => (
              <div key={req.id} className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-medium text-[#F1F5F9]">{req.title}</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">{req.clause} · Page {req.page} · AI Confidence: {req.confidence}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
