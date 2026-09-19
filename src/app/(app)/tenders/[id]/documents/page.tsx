'use client';
import { useAppState } from '@/lib/store';
import { useParams } from 'next/navigation';
import { FileText, CheckCircle2, AlertTriangle, XCircle, Eye, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function DocumentViewerPage() {
  const { requirements, evidence } = useAppState();
  const [selectedReq, setSelectedReq] = useState(requirements[0] || null);
  const matchedEvidence = evidence.find(e => e.matchedRequirement === selectedReq?.id);

  return (
    <div className="space-y-6" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      <div><h1 className="text-2xl font-bold text-[#F1F5F9]">Document Viewer</h1><p className="text-sm text-[#64748B] mt-1">Side-by-side tender clause and company evidence comparison</p></div>
      <div className="grid lg:grid-cols-12 gap-4">
        {/* Requirement selector */}
        <div className="lg:col-span-3 bg-[#141B2D] border border-[#1E293B] rounded-xl overflow-hidden">
          <div className="p-3 border-b border-[#1E293B]"><p className="text-xs text-[#64748B] uppercase tracking-wider font-semibold">Requirements</p></div>
          <div className="max-h-[600px] overflow-y-auto">
            {requirements.slice(0, 20).map(req => {
              const isActive = selectedReq?.id === req.id;
              const color = req.status === 'satisfied' ? 'text-emerald-400' : req.status === 'missing' ? 'text-red-400' : 'text-amber-400';
              const Icon = req.status === 'satisfied' ? CheckCircle2 : req.status === 'missing' ? XCircle : AlertTriangle;
              return (
                <button key={req.id} onClick={() => setSelectedReq(req)} className={`w-full text-left px-3 py-2.5 border-b border-[#1E293B]/50 transition-colors flex items-center gap-2 ${isActive ? 'bg-indigo-500/10' : 'hover:bg-[#1E2842]/50'}`}>
                  <Icon className={`w-3 h-3 shrink-0 ${color}`} />
                  <span className={`text-xs truncate ${isActive ? 'text-[#F1F5F9] font-medium' : 'text-[#94A3B8]'}`}>{req.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Side-by-side viewer */}
        {selectedReq && (
          <div className="lg:col-span-9 grid md:grid-cols-2 gap-4">
            {/* Left: Tender clause */}
            <div className="bg-[#141B2D] border border-[#1E293B] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#1E293B] bg-[#0F1525] flex items-center gap-2">
                <FileText className="w-3 h-3 text-indigo-400" />
                <span className="text-xs font-semibold text-[#F1F5F9]">Tender Document</span>
                <span className="ml-auto text-[10px] text-[#475569] font-mono">Page {selectedReq.page}</span>
              </div>
              <div className="p-5">
                <div className="bg-[#0A0E1A] rounded-lg p-4 border border-[#1E293B]">
                  <div className="text-[10px] text-[#475569] uppercase tracking-wider font-semibold mb-3">{selectedReq.section}</div>
                  <div className="border-l-2 border-indigo-500/30 pl-3">
                    <p className="text-xs text-[#64748B] font-mono mb-1">{selectedReq.clause}</p>
                    <p className="text-sm text-[#F1F5F9] leading-relaxed">{selectedReq.description}</p>
                    {selectedReq.threshold && <p className="text-sm text-indigo-400 font-semibold mt-2">Required: {selectedReq.threshold}</p>}
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <span className="text-[10px] text-[#475569] font-mono">{selectedReq.sourceDocument} — Page {selectedReq.page}</span>
                </div>
              </div>
            </div>

            {/* Right: Company evidence */}
            <div className="bg-[#141B2D] border border-[#1E293B] rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#1E293B] bg-[#0F1525] flex items-center gap-2">
                <Eye className="w-3 h-3 text-emerald-400" />
                <span className="text-xs font-semibold text-[#F1F5F9]">Company Evidence</span>
              </div>
              <div className="p-5">
                {matchedEvidence ? (
                  <div className="bg-[#0A0E1A] rounded-lg p-4 border border-[#1E293B]">
                    <div className="text-[10px] text-[#475569] uppercase tracking-wider font-semibold mb-3">{matchedEvidence.documentName}</div>
                    <div className="border-l-2 border-emerald-500/30 pl-3">
                      <p className="text-xs text-[#64748B] font-mono mb-1">Page {matchedEvidence.page} · {matchedEvidence.section}</p>
                      <p className="text-sm text-[#F1F5F9] leading-relaxed italic">&ldquo;{matchedEvidence.excerpt}&rdquo;</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                      <span className="text-[10px] text-[#475569]">Confidence: {matchedEvidence.confidence}%</span>
                      {matchedEvidence.verificationStatus === 'verified' && <span className="text-[10px] text-emerald-400 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Verified</span>}
                    </div>
                  </div>
                ) : selectedReq.companyValue ? (
                  <div className="bg-[#0A0E1A] rounded-lg p-4 border border-[#1E293B]">
                    <div className="text-[10px] text-[#475569] uppercase tracking-wider font-semibold mb-3">Company Data</div>
                    <p className={`text-lg font-bold ${selectedReq.status === 'satisfied' ? 'text-emerald-400' : selectedReq.status === 'missing' ? 'text-red-400' : 'text-amber-400'}`}>{selectedReq.companyValue}</p>
                    {selectedReq.evidenceDocuments.length > 0 && <p className="text-xs text-[#64748B] mt-2 font-mono">{selectedReq.evidenceDocuments[0]}</p>}
                  </div>
                ) : (
                  <div className="text-center py-12"><XCircle className="w-8 h-8 text-red-400/50 mx-auto mb-2" /><p className="text-sm text-[#64748B]">No evidence uploaded</p></div>
                )}

                {/* Match status */}
                <div className={`mt-4 p-3 rounded-lg border ${selectedReq.status === 'satisfied' ? 'bg-emerald-500/5 border-emerald-500/15' : selectedReq.status === 'missing' ? 'bg-red-500/5 border-red-500/15' : 'bg-amber-500/5 border-amber-500/15'}`}>
                  <div className="flex items-center gap-2">
                    {selectedReq.status === 'satisfied' && <><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span className="text-xs font-semibold text-emerald-400">MATCHED — Requirement appears satisfied</span></>}
                    {selectedReq.status === 'missing' && <><XCircle className="w-4 h-4 text-red-400" /><span className="text-xs font-semibold text-red-400">NOT MATCHED — Evidence missing</span></>}
                    {selectedReq.status === 'review' && <><AlertTriangle className="w-4 h-4 text-amber-400" /><span className="text-xs font-semibold text-amber-400">NEEDS VERIFICATION — Human review required</span></>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
