'use client';

import { useAppState } from '@/lib/store';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import {
  CheckCircle2, AlertTriangle, XCircle, HelpCircle, Search, Filter,
  ChevronRight, FileText, Eye, X, Upload, ChevronDown, Shield
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import type { Requirement, RequirementCategory, RequirementStatus } from '@/lib/data';

// Status config
const statusConfig: Record<RequirementStatus, { icon: React.ElementType; label: string; color: string; bgColor: string; borderColor: string }> = {
  satisfied: { icon: CheckCircle2, label: 'SATISFIED', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20' },
  review: { icon: AlertTriangle, label: 'REVIEW', color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20' },
  missing: { icon: XCircle, label: 'MISSING', color: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/20' },
  unknown: { icon: HelpCircle, label: 'UNKNOWN', color: 'text-[#64748B]', bgColor: 'bg-[#1E293B]', borderColor: 'border-[#334155]' },
};

const categoryLabels: Record<RequirementCategory, string> = {
  eligibility: 'Eligibility', financial: 'Financial', technical: 'Technical',
  experience: 'Experience', legal: 'Legal', documentation: 'Documentation',
  submission: 'Submission', other: 'Other',
};

// ── Requirement Detail Drawer ────────────────────────────────────
function RequirementDrawer({ requirement, onClose }: { requirement: Requirement; onClose: () => void }) {
  const { updateRequirementStatus, simulateUpload } = useAppState();
  const status = statusConfig[requirement.status];
  const StatusIcon = status.icon;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} style={{ animation: 'fade-in 0.2s ease-out' }} />
      <div className="fixed top-0 right-0 w-[520px] max-w-[90vw] h-screen bg-[#0F1525] border-l border-[#1E293B] z-[51] overflow-y-auto shadow-2xl" style={{ animation: 'slide-in-right 0.3s ease-out' }}>
        {/* Header */}
        <div className="sticky top-0 bg-[#0F1525] p-6 border-b border-[#1E293B] flex items-start justify-between z-10">
          <div className="flex-1 min-w-0 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${status.bgColor} ${status.borderColor} ${status.color}`}>
                <StatusIcon className="w-3 h-3" />
                {status.label}
              </span>
              {requirement.mandatory && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  Mandatory
                </span>
              )}
            </div>
            <h3 className="text-lg font-bold text-[#F1F5F9]">{requirement.title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#1E2842] text-[#64748B]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <label className="text-[10px] text-[#475569] uppercase tracking-widest font-semibold">Description</label>
            <p className="text-sm text-[#94A3B8] mt-1.5 leading-relaxed">{requirement.description}</p>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] text-[#475569] uppercase tracking-widest font-semibold">Category</label>
              <p className="text-sm text-[#F1F5F9] mt-1 capitalize">{requirement.category}</p>
            </div>
            <div>
              <label className="text-[10px] text-[#475569] uppercase tracking-widest font-semibold">Risk Level</label>
              <p className={`text-sm mt-1 font-medium capitalize ${
                requirement.risk === 'high' ? 'text-red-400' : requirement.risk === 'medium' ? 'text-amber-400' : 'text-emerald-400'
              }`}>{requirement.risk}</p>
            </div>
          </div>

          {/* Source */}
          <div className="bg-[#0A0E1A] rounded-xl p-4">
            <label className="text-[10px] text-[#475569] uppercase tracking-widest font-semibold">Source Reference</label>
            <div className="flex items-center gap-2 mt-2">
              <FileText className="w-4 h-4 text-[#64748B]" />
              <span className="text-sm text-[#F1F5F9]">{requirement.sourceDocument}</span>
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-[#64748B] font-mono">
              <span>Page {requirement.page}</span>
              <span>{requirement.section}</span>
              <span>{requirement.clause}</span>
            </div>
          </div>

          {/* Threshold vs Company */}
          {(requirement.threshold || requirement.companyValue) && (
            <div className="grid grid-cols-2 gap-4">
              {requirement.threshold && (
                <div className="bg-[#0A0E1A] rounded-xl p-4">
                  <label className="text-[10px] text-[#475569] uppercase tracking-widest font-semibold">Required</label>
                  <p className="text-sm text-[#F1F5F9] font-semibold mt-1">{requirement.threshold}</p>
                </div>
              )}
              {requirement.companyValue && (
                <div className="bg-[#0A0E1A] rounded-xl p-4">
                  <label className="text-[10px] text-[#475569] uppercase tracking-widest font-semibold">Company Value</label>
                  <p className={`text-sm font-semibold mt-1 ${
                    requirement.status === 'satisfied' ? 'text-emerald-400' : requirement.status === 'missing' ? 'text-red-400' : 'text-amber-400'
                  }`}>{requirement.companyValue}</p>
                </div>
              )}
            </div>
          )}

          {/* Evidence Documents */}
          {requirement.evidenceDocuments.length > 0 && (
            <div>
              <label className="text-[10px] text-[#475569] uppercase tracking-widest font-semibold">Evidence Documents</label>
              <div className="mt-2 space-y-2">
                {requirement.evidenceDocuments.map((doc, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-[#0A0E1A] rounded-lg">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span className="text-sm text-[#F1F5F9]">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Explanation */}
          <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <label className="text-[10px] text-indigo-400 uppercase tracking-widest font-semibold">AI Analysis</label>
              <span className="ml-auto text-[10px] text-[#64748B] font-mono">Confidence: {requirement.confidence}%</span>
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed">{requirement.aiExplanation}</p>
            <p className="text-[10px] text-[#475569] mt-3 italic">
              AI confidence — not a guarantee of compliance. Human verification recommended.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            {requirement.status === 'missing' && (
              <button
                onClick={() => simulateUpload(requirement.id)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all"
              >
                <Upload className="w-4 h-4" />
                Upload Evidence
              </button>
            )}
            {requirement.reviewStatus === 'pending' && requirement.status !== 'missing' && (
              <>
                <button
                  onClick={() => updateRequirementStatus(requirement.id, 'approved')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Verified
                </button>
                <button
                  onClick={() => updateRequirementStatus(requirement.id, 'rejected')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A2238] border border-[#1E293B] text-[#F1F5F9] rounded-lg text-sm font-medium hover:bg-[#1E2842] transition-all"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </>
            )}
            {requirement.reviewStatus === 'approved' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Human Verified
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Page Content ────────────────────────────────────────────
function RequirementsContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { requirements } = useAppState();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedReq, setSelectedReq] = useState<Requirement | null>(null);

  // Open from URL param
  useEffect(() => {
    const sel = searchParams.get('selected');
    if (sel) {
      const req = requirements.find(r => r.id === sel);
      if (req) setSelectedReq(req);
    }
  }, [searchParams, requirements]);

  const filtered = useMemo(() => {
    return requirements.filter(r => {
      if (statusFilter !== 'all') {
        if (statusFilter === 'mandatory' && !r.mandatory) return false;
        if (statusFilter === 'high-risk' && r.risk !== 'high') return false;
        if (['satisfied', 'review', 'missing'].includes(statusFilter) && r.status !== statusFilter) return false;
      }
      if (categoryFilter !== 'all' && r.category !== categoryFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.clause.toLowerCase().includes(q);
      }
      return true;
    });
  }, [requirements, statusFilter, categoryFilter, searchQuery]);

  const statusFilters = [
    { key: 'all', label: 'All', count: requirements.length },
    { key: 'mandatory', label: 'Mandatory', count: requirements.filter(r => r.mandatory).length },
    { key: 'missing', label: 'Missing', count: requirements.filter(r => r.status === 'missing').length },
    { key: 'review', label: 'Review', count: requirements.filter(r => r.status === 'review').length },
    { key: 'satisfied', label: 'Satisfied', count: requirements.filter(r => r.status === 'satisfied').length },
    { key: 'high-risk', label: 'High Risk', count: requirements.filter(r => r.risk === 'high').length },
  ];

  return (
    <div className="space-y-6" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F9]">Requirements</h1>
          <p className="text-sm text-[#64748B] mt-1">{requirements.length} requirements extracted · {requirements.filter(r => r.mandatory).length} mandatory</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#475569]" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search requirements..."
            className="w-full pl-10 pr-4 py-2 bg-[#141B2D] border border-[#1E293B] rounded-lg text-sm text-[#F1F5F9] placeholder:text-[#475569] outline-none focus:border-indigo-500/50"
          />
        </div>

        <div className="flex gap-1 bg-[#141B2D] border border-[#1E293B] rounded-lg p-1">
          {statusFilters.map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                statusFilter === f.key
                  ? 'bg-indigo-500/15 text-indigo-400'
                  : 'text-[#64748B] hover:text-[#94A3B8] hover:bg-[#1E2842]'
              }`}
            >
              {f.label}
              <span className="ml-1.5 text-[10px] opacity-60">{f.count}</span>
            </button>
          ))}
        </div>

        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          className="px-3 py-2 bg-[#141B2D] border border-[#1E293B] rounded-lg text-xs text-[#94A3B8] outline-none"
        >
          <option value="all">All Categories</option>
          {Object.entries(categoryLabels).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#141B2D] border border-[#1E293B] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0F1525]">
                <th className="text-left px-6 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest w-[40%]">Requirement</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Category</th>
                <th className="text-center px-4 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Mandatory</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Status</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Source</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Risk</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((req, i) => {
                const st = statusConfig[req.status];
                const StIcon = st.icon;
                return (
                  <tr
                    key={req.id}
                    className="border-t border-[#1E293B]/50 hover:bg-[#1E2842]/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedReq(req)}
                    style={{ animation: `fade-in-up 0.3s ease-out ${Math.min(i * 0.03, 0.5)}s both` }}
                  >
                    <td className="px-6 py-3.5">
                      <p className="text-sm font-medium text-[#F1F5F9]">{req.title}</p>
                      <p className="text-xs text-[#64748B] mt-0.5 line-clamp-1">{req.description}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-[#94A3B8] capitalize">{req.category}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {req.mandatory ? (
                        <span className="text-xs text-indigo-400 font-medium">Yes</span>
                      ) : (
                        <span className="text-xs text-[#475569]">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${st.bgColor} ${st.borderColor} ${st.color}`}>
                        <StIcon className="w-3 h-3" />
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs text-[#64748B] font-mono">{req.clause} · P{req.page}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`text-xs font-medium capitalize ${
                        req.risk === 'high' ? 'text-red-400' : req.risk === 'medium' ? 'text-amber-400' : 'text-emerald-400'
                      }`}>{req.risk}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <ChevronRight className="w-4 h-4 text-[#475569]" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Search className="w-8 h-8 text-[#475569] mx-auto mb-3" />
            <p className="text-sm text-[#64748B]">No requirements match your filters.</p>
          </div>
        )}
      </div>

      {/* Drawer */}
      {selectedReq && (
        <RequirementDrawer requirement={selectedReq} onClose={() => setSelectedReq(null)} />
      )}
    </div>
  );
}

export default function RequirementsPage() {
  return (
    <Suspense fallback={<div className="animate-pulse bg-[#1E293B] rounded-xl h-96" />}>
      <RequirementsContent />
    </Suspense>
  );
}
