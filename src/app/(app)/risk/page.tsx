'use client';

import { useAppState } from '@/lib/store';
import { AlertTriangle, Shield, ChevronRight, Clock, DollarSign, Wrench, FileText, HelpCircle, XCircle } from 'lucide-react';

const riskIcons: Record<string, React.ElementType> = {
  Experience: Shield, Documentation: FileText, Financial: DollarSign,
  Technical: Wrench, Deadline: Clock, Ambiguity: HelpCircle,
};

export default function RiskCenterPage() {
  const { risks } = useAppState();

  const highRisks = risks.filter(r => r.level === 'high');
  const mediumRisks = risks.filter(r => r.level === 'medium');
  const lowRisks = risks.filter(r => r.level === 'low');

  if (risks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="w-12 h-12 text-[#475569] mb-4" />
        <h2 className="text-xl font-bold text-[#F1F5F9] mb-2">No Risk Data</h2>
        <p className="text-[#94A3B8]">Load a tender to view risk analysis.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      <div>
        <h1 className="text-2xl font-bold text-[#F1F5F9]">Tender Risk Center</h1>
        <p className="text-sm text-[#64748B] mt-1">Compliance and submission risk analysis</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'High Risk', count: highRisks.length, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/15' },
          { label: 'Medium Risk', count: mediumRisks.length, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/15' },
          { label: 'Low Risk', count: lowRisks.length, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/15' },
        ].map(item => (
          <div key={item.label} className={`${item.bg} border ${item.border} rounded-xl p-5 text-center`}>
            <p className={`text-3xl font-bold ${item.color}`}>{item.count}</p>
            <p className="text-xs text-[#64748B] uppercase tracking-wider mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Risk Cards */}
      {[
        { title: 'High Risk', items: highRisks, borderColor: 'border-red-500/20', iconColor: 'text-red-400', bgColor: 'bg-red-500/5' },
        { title: 'Medium Risk', items: mediumRisks, borderColor: 'border-amber-500/20', iconColor: 'text-amber-400', bgColor: 'bg-amber-500/5' },
      ].map(group => group.items.length > 0 && (
        <div key={group.title}>
          <h2 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">{group.title}</h2>
          <div className="space-y-3">
            {group.items.map((risk, i) => {
              const Icon = riskIcons[risk.category] || AlertTriangle;
              return (
                <div key={risk.id} className={`${group.bgColor} border ${group.borderColor} rounded-xl p-5`} style={{ animation: `fade-in-up 0.4s ease-out ${i * 0.05}s both` }}>
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${group.bgColor}`}>
                      <Icon className={`w-5 h-5 ${group.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-[#F1F5F9]">{risk.title}</h3>
                          <p className="text-xs text-[#64748B] mt-0.5">{risk.category} Risk</p>
                        </div>
                        <span className="text-xs font-mono text-[#64748B]">{risk.source}</span>
                      </div>
                      <p className="text-sm text-[#94A3B8] mt-2 leading-relaxed">{risk.description}</p>

                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="bg-[#0A0E1A] rounded-lg p-3">
                          <p className="text-[10px] text-[#475569] uppercase tracking-wider font-semibold mb-1">Impact</p>
                          <p className="text-xs text-[#94A3B8]">{risk.impact}</p>
                        </div>
                        <div className="bg-[#0A0E1A] rounded-lg p-3">
                          <p className="text-[10px] text-[#475569] uppercase tracking-wider font-semibold mb-1">Recommended Action</p>
                          <p className="text-xs text-[#94A3B8]">{risk.suggestedAction}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <p className="text-xs text-[#475569] italic text-center pt-4">
        Risk assessment is based on AI analysis and deterministic comparison. All findings require human verification.
        This is not legal advice.
      </p>
    </div>
  );
}
