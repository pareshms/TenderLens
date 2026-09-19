'use client';

import { useAppState } from '@/lib/store';
import { useRouter } from 'next/navigation';
import {
  FileText, Users, CheckCircle2, AlertTriangle, Clock, ArrowRight,
  TrendingUp, Gauge, ChevronRight, Activity, Star, Upload, Loader2, Sparkles, FileUp
} from 'lucide-react';
import { useEffect, useState } from 'react';

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const p = Math.min((Date.now() - start) / 1200, 1);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <>{v}{suffix}</>;
}

export default function DashboardPage() {
  const { tenders, requirements, setActiveTender, addTender, apiKey, companyProfile, addToast } = useAppState();
  const router = useRouter();

  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [sampleText, setSampleText] = useState('');

  const processTenderDocument = async (text: string, filename: string) => {
    setIsUploading(true);
    addToast({
      type: 'info',
      title: 'Parsing Tender Document',
      message: 'Analyzing compliance clauses, monetary figures, and eligibility criteria...',
    });

    try {
      const res = await fetch('/api/ai/parse-tender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          filename,
          customApiKey: apiKey,
          companyProfile,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to parse document');
      }

      addTender(data.tender, data.requirements, data.risks, data.document);
      router.push(`/tenders/${data.tender.id}`);
    } catch (err: any) {
      console.error('Upload parse error:', err);
      addToast({
        type: 'danger',
        title: 'Parsing Error',
        message: err.message || 'Could not process document text.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      await processTenderDocument(content || file.name, file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      await processTenderDocument(content || file.name, file.name);
    };
    reader.readAsText(file);
  };

  const activeTenders = tenders.filter(t => t.status !== 'archived');
  const totalReqs = tenders.reduce((s, t) => s + t.totalRequirements, 0);
  const upcomingDeadlines = tenders.filter(t => t.daysRemaining <= 14).length;
  const avgReadiness = tenders.length > 0 ? Math.round(tenders.reduce((s, t) => s + t.readiness, 0) / tenders.length) : 0;

  const kpis = [
    { label: 'Active Tenders', value: activeTenders.length, icon: FileText, color: 'text-blue-400', bgColor: 'from-blue-500/10 to-cyan-500/10' },
    { label: 'Requirements Analyzed', value: totalReqs, icon: CheckCircle2, color: 'text-emerald-400', bgColor: 'from-emerald-500/10 to-teal-500/10' },
    { label: 'Upcoming Deadlines', value: upcomingDeadlines, icon: Clock, color: 'text-amber-400', bgColor: 'from-amber-500/10 to-orange-500/10' },
    { label: 'Average Readiness', value: avgReadiness, suffix: '%', icon: Gauge, color: 'text-indigo-400', bgColor: 'from-indigo-500/10 to-purple-500/10' },
  ];

  const riskColors: Record<string, string> = {
    low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    high: 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  const statusColors: Record<string, string> = {
    'analyzing': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    'in-review': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'ready': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'submitted': 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  };

  return (
    <div className="space-y-8" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      {/* Header & Quick Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F9]">Procurement Command Center</h1>
          <p className="text-sm text-[#64748B] mt-1">Real-time tender compliance matrix, evidence graph, and AI risk analysis.</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium rounded-xl shadow-lg shadow-indigo-500/20 transition-all text-xs">
            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
            <span>Upload Real Tender</span>
            <input type="file" onChange={handleFileUpload} accept=".pdf,.txt,.docx,.json,.md" className="hidden" />
          </label>
        </div>
      </div>

      {/* Instant Dropzone Bar */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative p-6 rounded-2xl border-2 border-dashed transition-all ${
          dragOver ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]' : 'border-[#1E293B] bg-[#141B2D]/60 hover:border-[#334155]'
        }`}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
              {isUploading ? <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" /> : <Sparkles className="w-6 h-6 text-indigo-400" />}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#F1F5F9]">Instant AI Tender Analysis Engine</h3>
              <p className="text-xs text-[#64748B] mt-0.5">Drag and drop tender RFP (PDF, DOCX, TXT) or paste raw text to generate requirements & risk matrix.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <input
              type="text"
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              placeholder="Or paste tender text / URL..."
              className="flex-1 md:w-64 bg-[#0A0E1A] border border-[#1E293B] text-xs text-[#F1F5F9] rounded-lg px-3 py-2 outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => {
                if (sampleText.trim()) processTenderDocument(sampleText, 'Pasted_Tender_Doc.txt');
              }}
              disabled={!sampleText.trim() || isUploading}
              className="px-3 py-2 bg-[#1A2238] hover:bg-[#1E2842] disabled:opacity-50 text-xs font-semibold text-indigo-400 border border-[#1E293B] rounded-lg transition-colors shrink-0"
            >
              Analyze
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <div
            key={kpi.label}
            className={`relative bg-[#141B2D] border border-[#1E293B] rounded-xl p-5 overflow-hidden transition-all hover:border-[#334155] hover:-translate-y-0.5 group`}
            style={{ animation: `fade-in-up 0.5s ease-out ${i * 0.08}s both` }}
          >
            <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${kpi.bgColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-2">{kpi.label}</p>
                <p className="text-3xl font-bold text-[#F1F5F9]">
                  <AnimatedNumber target={kpi.value} suffix={kpi.suffix || ''} />
                </p>
              </div>
              <div className={`p-2.5 rounded-xl bg-gradient-to-br ${kpi.bgColor}`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Active Tenders Table */}
      <div className="bg-[#141B2D] border border-[#1E293B] rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-semibold text-[#F1F5F9]">Active Tender Portfolio</h2>
          </div>
          <button
            onClick={() => router.push('/tenders')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
          >
            View All Tenders <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#0F1525]">
                <th className="text-left px-6 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Tender & ID</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Organization</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Value</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Deadline</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Readiness</th>
                <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Risk Level</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {tenders.map((tender, i) => (
                <tr
                  key={tender.id}
                  className="border-t border-[#1E293B]/50 hover:bg-[#1E2842]/50 transition-colors cursor-pointer"
                  onClick={() => { setActiveTender(tender.id); router.push(`/tenders/${tender.id}`); }}
                  style={{ animation: `fade-in-up 0.4s ease-out ${i * 0.05}s both` }}
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-[#F1F5F9]">{tender.title}</p>
                      <p className="text-xs text-[#64748B] font-mono mt-0.5">{tender.tenderId}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-[#94A3B8]">{tender.organization}</td>
                  <td className="px-4 py-4 text-sm font-semibold text-emerald-400">{tender.estimatedValue}</td>
                  <td className="px-4 py-4">
                    <div>
                      <p className="text-sm text-[#F1F5F9]">{new Date(tender.submissionDeadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <p className={`text-xs font-medium mt-0.5 ${tender.daysRemaining <= 7 ? 'text-red-400' : 'text-[#64748B]'}`}>
                        {tender.daysRemaining} days remaining
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${tender.readiness >= 80 ? 'bg-emerald-500' : tender.readiness >= 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                          style={{ width: `${tender.readiness}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[#F1F5F9] tabular-nums">{tender.readiness}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${riskColors[tender.risk]}`}>
                      {tender.risk}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <button className="p-1.5 rounded-lg hover:bg-[#243050] text-[#64748B] hover:text-[#F1F5F9] transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
