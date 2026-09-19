'use client';

import { useAppState } from '@/lib/store';
import { useRouter, useParams } from 'next/navigation';
import {
  CheckCircle2, AlertTriangle, XCircle, HelpCircle, Clock, FileText,
  ArrowRight, GitBranch, Shield, ChevronRight, Activity, Eye, Upload,
  BarChart3, MessageSquare, Download, Play, ListChecks
} from 'lucide-react';
import { useEffect, useState } from 'react';

function RadialGauge({ value, size = 160, strokeWidth = 10 }: { value: number; size?: number; strokeWidth?: number }) {
  const [animValue, setAnimValue] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    const timer = setTimeout(() => setAnimValue(value), 100);
    return () => clearTimeout(timer);
  }, [value]);

  const offset = circumference - (animValue / 100) * circumference;
  const color = value >= 80 ? '#10B981' : value >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="#1E293B" strokeWidth={strokeWidth} />
        <circle
          cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-3xl font-bold text-[#F1F5F9]">{animValue}%</span>
      </div>
    </div>
  );
}

export default function TenderAnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const { tenders, requirements, risks, tasks } = useAppState();

  const tenderId = params.id as string;
  const tender = tenders.find(t => t.id === tenderId);

  if (!tender) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <XCircle className="w-12 h-12 text-[#475569] mb-4" />
        <h2 className="text-xl font-bold text-[#F1F5F9] mb-2">Tender Not Found</h2>
        <p className="text-[#94A3B8] mb-6">The requested tender does not exist or has not been loaded.</p>
        <button onClick={() => router.push('/dashboard')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">
          Go to Dashboard
        </button>
      </div>
    );
  }

  const tenderReqs = requirements.filter(() => true); // All demo reqs are for tnd-001
  const satisfiedCount = tenderReqs.filter(r => r.status === 'satisfied').length;
  const reviewCount = tenderReqs.filter(r => r.status === 'review').length;
  const missingCount = tenderReqs.filter(r => r.status === 'missing').length;
  const criticalGaps = tenderReqs.filter(r => r.status === 'missing' && r.mandatory).length;
  const warnings = tenderReqs.filter(r => r.status === 'review').length;

  const categories = [
    { label: 'Eligibility', value: 92, color: 'bg-emerald-500' },
    { label: 'Technical', value: 81, color: 'bg-blue-500' },
    { label: 'Financial', value: 76, color: 'bg-indigo-500' },
    { label: 'Documentation', value: 61, color: 'bg-amber-500' },
    { label: 'Experience', value: 83, color: 'bg-purple-500' },
  ];

  const quickLinks = [
    { label: 'Requirements', icon: ListChecks, href: `/tenders/${tenderId}/requirements`, count: tenderReqs.length },
    { label: 'Evidence Graph', icon: GitBranch, href: `/tenders/${tenderId}/evidence-graph` },
    { label: 'Document Viewer', icon: Eye, href: `/tenders/${tenderId}/documents` },
    { label: 'Lens AI', icon: MessageSquare, href: `/tenders/${tenderId}/copilot` },
    { label: 'Gap Analysis', icon: AlertTriangle, href: `/tenders/${tenderId}/gaps` },
    { label: 'Action Plan', icon: Activity, href: `/tenders/${tenderId}/actions` },
  ];

  return (
    <div className="space-y-8" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-[#64748B] mb-2">
            <button onClick={() => router.push('/tenders')} className="hover:text-[#94A3B8] transition-colors">Tenders</button>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#94A3B8]">Analysis</span>
          </div>
          <h1 className="text-2xl font-bold text-[#F1F5F9] mb-1">{tender.title}</h1>
          <div className="flex items-center gap-4 text-sm text-[#64748B]">
            <span className="font-mono">{tender.tenderId}</span>
            <span>·</span>
            <span>{tender.organization}</span>
            <span>·</span>
            <span className="font-semibold text-[#F1F5F9]">{tender.estimatedValue}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
            tender.daysRemaining <= 7 ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
          }`}>
            <Clock className="w-3 h-3" />
            {tender.daysRemaining} days remaining
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A2238] border border-[#1E293B] rounded-lg text-sm text-[#F1F5F9] hover:bg-[#1E2842] transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm text-white font-medium transition-colors">
            <Play className="w-4 h-4" />
            Start Review
          </button>
        </div>
      </div>

      {/* Readiness Overview */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Gauge */}
        <div className="lg:col-span-1 bg-[#141B2D] border border-[#1E293B] rounded-xl p-6 flex flex-col items-center justify-center">
          <p className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-4">Bid Readiness</p>
          <RadialGauge value={tender.readiness} />
          <div className="grid grid-cols-3 gap-4 mt-6 w-full">
            <div className="text-center">
              <div className="text-lg font-bold text-emerald-400">{satisfiedCount}</div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider">Satisfied</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-amber-400">{reviewCount}</div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider">Review</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-400">{missingCount}</div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider">Missing</div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-1 bg-[#141B2D] border border-[#1E293B] rounded-xl p-6">
          <p className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-5">Category Readiness</p>
          <div className="space-y-4">
            {categories.map(cat => (
              <div key={cat.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-[#94A3B8]">{cat.label}</span>
                  <span className="text-sm font-semibold text-[#F1F5F9] tabular-nums">{cat.value}%</span>
                </div>
                <div className="h-2 bg-[#1E293B] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${cat.value}%`, transition: 'width 1s ease-out' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-red-500/5 border border-red-500/15 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#F1F5F9]">{criticalGaps}</p>
                <p className="text-xs text-[#64748B] uppercase tracking-wider">Critical Gaps</p>
              </div>
            </div>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#F1F5F9]">{warnings}</p>
                <p className="text-xs text-[#64748B] uppercase tracking-wider">Warnings</p>
              </div>
            </div>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#F1F5F9]">{satisfiedCount}</p>
                <p className="text-xs text-[#64748B] uppercase tracking-wider">Verified Requirements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {quickLinks.map(link => (
          <button
            key={link.label}
            onClick={() => router.push(link.href)}
            className="flex flex-col items-center gap-2 p-4 bg-[#141B2D] border border-[#1E293B] rounded-xl hover:border-indigo-500/30 hover:bg-[#1A2238] transition-all group"
          >
            <link.icon className="w-5 h-5 text-[#64748B] group-hover:text-indigo-400 transition-colors" />
            <span className="text-xs font-medium text-[#94A3B8] group-hover:text-[#F1F5F9] transition-colors">{link.label}</span>
            {link.count && <span className="text-[10px] text-[#475569] font-mono">{link.count} items</span>}
          </button>
        ))}
      </div>

      {/* Top Missing Requirements */}
      <div className="bg-[#141B2D] border border-[#1E293B] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <h2 className="text-base font-semibold text-[#F1F5F9]">Critical Missing Requirements</h2>
          </div>
          <button onClick={() => router.push(`/tenders/${tenderId}/requirements`)} className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="divide-y divide-[#1E293B]/50">
          {tenderReqs.filter(r => r.status === 'missing' && r.mandatory).slice(0, 5).map(req => (
            <div key={req.id} className="px-6 py-4 flex items-center gap-4 hover:bg-[#1E2842]/30 transition-colors cursor-pointer"
              onClick={() => router.push(`/tenders/${tenderId}/requirements?selected=${req.id}`)}>
              <div className="p-1.5 rounded-lg bg-red-500/10">
                <XCircle className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#F1F5F9]">{req.title}</p>
                <p className="text-xs text-[#64748B] mt-0.5 truncate">{req.description}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-mono text-[#64748B]">{req.clause}</span>
                <p className="text-[10px] text-[#475569]">Page {req.page}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-[#475569]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
