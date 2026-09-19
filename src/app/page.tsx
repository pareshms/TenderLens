'use client';

import { useRouter } from 'next/navigation';
import { useAppState } from '@/lib/store';
import {
  Shield, FileSearch, GitBranch, CheckCircle2, AlertTriangle, Clock,
  ArrowRight, Zap, Target, Eye, BarChart3, FileText, Users, Lock,
  ChevronRight, Star, Layers, Search, ClipboardList, Activity
} from 'lucide-react';
import { useState, useEffect } from 'react';

// ── Animated Counter ─────────────────────────────────────────────
function AnimatedNumber({ target, duration = 1500, suffix = '' }: { target: number; duration?: number; suffix?: string }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(target * eased));
      if (progress >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <>{current}{suffix}</>;
}

// ── Hero Analysis Preview ────────────────────────────────────────
function HeroPreview() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 300); }, []);

  return (
    <div className={`relative transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
      <div className="bg-[#0F1525]/80 backdrop-blur-xl border border-[#1E293B] rounded-2xl p-6 shadow-2xl max-w-md mx-auto">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-[#64748B] font-mono">TenderLens — Analysis</span>
        </div>

        <div className="text-center mb-5">
          <p className="text-xs text-[#64748B] uppercase tracking-widest font-semibold mb-1">Tender Analysis</p>
          <p className="text-sm text-[#94A3B8]">Urban Mobility Infrastructure Package</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-400"><AnimatedNumber target={64} /></div>
            <div className="text-[10px] text-[#64748B] uppercase tracking-wider mt-1">Satisfied</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-400"><AnimatedNumber target={14} /></div>
            <div className="text-[10px] text-[#64748B] uppercase tracking-wider mt-1">Review</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400"><AnimatedNumber target={9} /></div>
            <div className="text-[10px] text-[#64748B] uppercase tracking-wider mt-1">Missing</div>
          </div>
        </div>

        <div className="bg-[#0A0E1A] rounded-xl p-4 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-[#64748B] uppercase tracking-wider font-semibold">Readiness</span>
            <span className="text-xs font-mono text-[#94A3B8]">87 requirements</span>
          </div>
          <div className="flex items-end gap-3">
            <div className="text-4xl font-bold text-[#F1F5F9]"><AnimatedNumber target={74} suffix="%" duration={2000} /></div>
          </div>
          <div className="mt-3 h-2 bg-[#1E293B] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all duration-2000" style={{ width: '74%', animation: 'progress-fill 2s ease-out' }} />
          </div>
        </div>

        <div className="space-y-2">
          {[
            { label: 'Eligibility', value: 92, color: 'bg-emerald-500' },
            { label: 'Technical', value: 81, color: 'bg-blue-500' },
            { label: 'Financial', value: 76, color: 'bg-indigo-500' },
            { label: 'Documentation', value: 61, color: 'bg-amber-500' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-xs text-[#64748B] w-24">{item.label}</span>
              <div className="flex-1 h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${item.color} transition-all duration-1000`} style={{ width: `${item.value}%`, animation: 'progress-fill 1.5s ease-out' }} />
              </div>
              <span className="text-xs font-mono text-[#94A3B8] w-10 text-right">{item.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Landing Page ────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();

  const handleEnter = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] overflow-x-hidden">
      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-600/[0.07] rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/[0.05] rounded-full blur-[150px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/[0.03] rounded-full blur-[200px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-[#F1F5F9] tracking-tight">TenderLens</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-sm text-[#94A3B8] hover:text-white transition-colors">How It Works</a>
          <a href="#evidence" className="text-sm text-[#94A3B8] hover:text-white transition-colors">Evidence Mode</a>
          <button
            onClick={handleEnter}
            className="text-sm font-medium px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all hover:shadow-lg hover:shadow-indigo-500/20"
          >
            Open App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-xs font-medium text-indigo-400 mb-6">
              <Zap className="w-3 h-3" />
              AI-Powered Procurement Intelligence
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.1] tracking-tight mb-6">
              <span className="text-[#F1F5F9]">Turn Complex Tenders</span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Into Clear Decisions.</span>
            </h1>

            <p className="text-lg text-[#94A3B8] leading-relaxed mb-8 max-w-xl">
              TenderLens reads tender documents, maps requirements to your evidence,
              identifies compliance gaps, and creates an actionable submission plan.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleEnter}
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-all hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5"
              >
                <FileSearch className="w-4 h-4" />
                Launch App Workspace
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A2238] hover:bg-[#1E2842] text-[#F1F5F9] font-medium rounded-xl border border-[#1E293B] transition-all"
              >
                See How It Works
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-6 mt-10 pt-6 border-t border-[#1E293B]">
              <div>
                <div className="text-2xl font-bold text-[#F1F5F9]"><AnimatedNumber target={87} /></div>
                <div className="text-xs text-[#64748B]">Requirements Detected</div>
              </div>
              <div className="w-px h-10 bg-[#1E293B]" />
              <div>
                <div className="text-2xl font-bold text-emerald-400"><AnimatedNumber target={96} suffix="%" /></div>
                <div className="text-xs text-[#64748B]">AI Confidence</div>
              </div>
              <div className="w-px h-10 bg-[#1E293B]" />
              <div>
                <div className="text-2xl font-bold text-[#F1F5F9]">&lt;30s</div>
                <div className="text-xs text-[#64748B]">Analysis Time</div>
              </div>
            </div>
          </div>

          <HeroPreview />
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative z-10 py-24 border-t border-[#1E293B]/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-4">
              A 200-page tender shouldn&apos;t require<br />a 200-page spreadsheet.
            </h2>
            <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
              Traditional tender evaluation is manual, error-prone, and time-consuming.
              TenderLens transforms the entire workflow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Manual Process */}
            <div className="bg-[#141B2D]/60 border border-red-500/10 rounded-2xl p-8">
              <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-6">Manual Process</div>
              <div className="space-y-4">
                {['Read 200+ page PDF', 'Search for requirements', 'Create Excel tracker', 'Email teams for evidence', 'Manually verify documents', 'Hope nothing is missed'].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border border-red-500/20 bg-red-500/5 flex items-center justify-center text-xs text-red-400 font-mono">{i + 1}</div>
                    <span className="text-sm text-[#94A3B8]">{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-[#1E293B]">
                <span className="text-xs text-red-400 font-medium">⏱ 3–5 days per tender</span>
              </div>
            </div>

            {/* TenderLens */}
            <div className="bg-[#141B2D]/60 border border-emerald-500/10 rounded-2xl p-8">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-6">With TenderLens</div>
              <div className="space-y-4">
                {['Upload tender PDF', 'AI extracts all requirements', 'Auto-matches company evidence', 'Evidence graph shows compliance', 'Identifies gaps & risks', 'Generates submission plan'].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border border-emerald-500/20 bg-emerald-500/5 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-sm text-[#F1F5F9]">{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-4 border-t border-[#1E293B]">
                <span className="text-xs text-emerald-400 font-medium">⚡ Under 30 seconds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-24 border-t border-[#1E293B]/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="text-xs text-indigo-400 uppercase tracking-widest font-semibold mb-3">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9]">From Document to Decision</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Upload', desc: 'Drop your tender PDF and company documents into the workspace.', icon: FileText, color: 'from-blue-500/20 to-cyan-500/20', borderColor: 'border-blue-500/20' },
              { step: '02', title: 'Understand', desc: 'AI extracts requirements, classifies them, and identifies thresholds.', icon: Search, color: 'from-indigo-500/20 to-purple-500/20', borderColor: 'border-indigo-500/20' },
              { step: '03', title: 'Verify', desc: 'Each requirement is matched against company evidence with citations.', icon: Eye, color: 'from-emerald-500/20 to-teal-500/20', borderColor: 'border-emerald-500/20' },
              { step: '04', title: 'Decide', desc: 'Review gaps, assess risks, and approve with full audit trail.', icon: Target, color: 'from-amber-500/20 to-orange-500/20', borderColor: 'border-amber-500/20' },
            ].map(item => (
              <div key={item.step} className={`group bg-[#141B2D]/60 border ${item.borderColor} rounded-2xl p-6 transition-all hover:border-opacity-50 hover:-translate-y-1`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                  <item.icon className="w-5 h-5 text-[#F1F5F9]" />
                </div>
                <div className="text-xs text-[#64748B] font-mono mb-2">STEP {item.step}</div>
                <h3 className="text-lg font-semibold text-[#F1F5F9] mb-2">{item.title}</h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evidence Mode */}
      <section id="evidence" className="relative z-10 py-24 border-t border-[#1E293B]/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="text-xs text-emerald-400 uppercase tracking-widest font-semibold mb-3">Evidence-Backed AI</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-4">
              Every conclusion is connected to evidence.
            </h2>
            <p className="text-lg text-[#64748B] max-w-2xl mx-auto">
              No unsupported AI conclusions. Every finding traces back to a specific page, clause, and document.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-[#141B2D] border border-[#1E293B] rounded-2xl overflow-hidden">
              {/* Evidence example */}
              <div className="p-6 border-b border-[#1E293B]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#F1F5F9]">Minimum Annual Turnover</h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> SATISFIED
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#0A0E1A] rounded-xl p-4">
                    <div className="text-[10px] text-[#64748B] uppercase tracking-wider mb-2 font-semibold">Tender Requirement</div>
                    <p className="text-sm text-[#F1F5F9]">Minimum ₹5 Crore average annual turnover</p>
                    <div className="mt-3 flex items-center gap-2">
                      <FileText className="w-3 h-3 text-[#64748B]" />
                      <span className="text-xs text-[#64748B] font-mono">Page 18 · Clause 4.2</span>
                    </div>
                  </div>
                  <div className="bg-[#0A0E1A] rounded-xl p-4">
                    <div className="text-[10px] text-[#64748B] uppercase tracking-wider mb-2 font-semibold">Company Evidence</div>
                    <p className="text-sm text-emerald-400 font-semibold">₹7.2 Crore</p>
                    <div className="mt-3 flex items-center gap-2">
                      <FileText className="w-3 h-3 text-[#64748B]" />
                      <span className="text-xs text-[#64748B] font-mono">Financial Statement · Page 18</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-[#94A3B8]">
                      The verified company turnover of ₹7.2 Crore exceeds the minimum requirement of ₹5 Crore.
                      Evidence sourced from audited financial statements for FY 2024–25.
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-[#64748B] font-mono">AI Confidence: 96%</span>
                      <span className="text-[10px] text-emerald-400">✓ Human Verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Missing example */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#F1F5F9]">Similar Completed Projects</h3>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs font-semibold text-red-400">
                    <AlertTriangle className="w-3 h-3" /> MISSING
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-[#0A0E1A] rounded-xl p-4">
                    <div className="text-[10px] text-[#64748B] uppercase tracking-wider mb-2 font-semibold">Tender Requirement</div>
                    <p className="text-sm text-[#F1F5F9]">Minimum 3 completed projects, ₹10 Cr each</p>
                    <div className="mt-3 flex items-center gap-2">
                      <FileText className="w-3 h-3 text-[#64748B]" />
                      <span className="text-xs text-[#64748B] font-mono">Page 27 · Clause 6.4</span>
                    </div>
                  </div>
                  <div className="bg-[#0A0E1A] rounded-xl p-4">
                    <div className="text-[10px] text-[#64748B] uppercase tracking-wider mb-2 font-semibold">Company Evidence</div>
                    <p className="text-sm text-amber-400 font-semibold">2 projects verified</p>
                    <div className="mt-3 flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-amber-400" />
                      <span className="text-xs text-amber-400">1 qualifying project missing</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-[#94A3B8]">
                    Potential compliance concern — human verification required. The third project (₹8.6 Cr)
                    does not meet the ₹10 Crore minimum threshold.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-24 border-t border-[#1E293B]/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <p className="text-xs text-indigo-400 uppercase tracking-widest font-semibold mb-3">Built for Real Work</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9]">Enterprise-Grade Procurement Intelligence</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: FileSearch, title: 'Tender Analysis', desc: 'Automatically extract and classify all requirements from tender documents.' },
              { icon: Shield, title: 'Eligibility Check', desc: 'Compare tender eligibility criteria against your company profile.' },
              { icon: GitBranch, title: 'Evidence Graph', desc: 'Interactive visual map connecting requirements to evidence and compliance.' },
              { icon: Eye, title: 'Evidence Mode', desc: 'Every AI finding traced to exact page, clause, and document.' },
              { icon: AlertTriangle, title: 'Risk Center', desc: 'Identify eligibility, financial, technical, and deadline risks.' },
              { icon: Clock, title: 'Deadline Tracking', desc: 'Visual timeline with countdown and task dependencies.' },
              { icon: ClipboardList, title: 'Submission Checklist', desc: 'Auto-generated task list with priorities and assignments.' },
              { icon: Users, title: 'Human Review', desc: 'Approve, reject, or override AI findings with audit trail.' },
              { icon: Lock, title: 'Audit Trail', desc: 'Complete record of every extraction, match, and decision.' },
              { icon: BarChart3, title: 'Analytics', desc: 'Procurement intelligence across your tender portfolio.' },
              { icon: Layers, title: 'Document Center', desc: 'Upload and manage tender and company documents.' },
              { icon: Activity, title: 'AI Copilot', desc: 'Ask questions about the tender with cited, grounded answers.' },
            ].map(item => (
              <div key={item.title} className="group bg-[#141B2D]/40 border border-[#1E293B] rounded-xl p-5 transition-all hover:border-[#334155] hover:bg-[#141B2D]/60">
                <item.icon className="w-5 h-5 text-indigo-400 mb-3" />
                <h3 className="text-sm font-semibold text-[#F1F5F9] mb-1.5">{item.title}</h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 border-t border-[#1E293B]/50">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#F1F5F9] mb-4">
            Ready to transform your tender process?
          </h2>
          <p className="text-lg text-[#94A3B8] mb-8">
            Load the demo workspace to explore a complete tender analysis with 87 requirements,
            evidence mapping, risk assessment, and an action plan.
          </p>
          <button
            onClick={handleEnter}
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-lg transition-all hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-0.5"
          >
            <Star className="w-5 h-5" />
            Launch Application Workspace
            <ChevronRight className="w-5 h-5" />
          </button>
          <p className="text-xs text-[#475569] mt-4">No sign-up required · Instant demo · All data is fictional</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1E293B]/50 py-8">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-semibold text-[#94A3B8]">TenderLens</span>
          </div>
          <p className="text-xs text-[#475569]">
            AI-powered procurement intelligence · Decision-support platform, not legal authority
          </p>
        </div>
      </footer>
    </div>
  );
}
