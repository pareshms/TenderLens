'use client';

import { useAppState } from '@/lib/store';
import { useParams } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, FileText, Shield, Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { copilotPresets } from '@/lib/data';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  citations?: { document: string; page: number; clause: string }[];
}

export default function CopilotPage() {
  const { requirements, risks } = useAppState();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateFallbackResponse = (question: string): ChatMessage => {
    const q = question.toLowerCase();

    if (q.includes('mandatory') || q.includes('eligibility')) {
      const mandatory = requirements.filter(r => r.mandatory && r.category === 'eligibility');
      return {
        role: 'assistant',
        content: `**Mandatory Eligibility Requirements:**\n\n${requirements.filter(r => r.mandatory).map((r, i) => `${i + 1}. **${r.title}** — ${r.description}\n   - Status: ${r.status.toUpperCase()} | Source: ${r.clause}, Page ${r.page}`).join('\n\n')}\n\n*${requirements.filter(r => r.mandatory).length} mandatory requirements identified across all categories.*`,
        citations: requirements.filter(r => r.mandatory).slice(0, 3).map(r => ({ document: r.sourceDocument, page: r.page, clause: r.clause })),
      };
    }

    if (q.includes('missing') || q.includes('document')) {
      const missing = requirements.filter(r => r.status === 'missing');
      return {
        role: 'assistant',
        content: `**Missing Requirements (${missing.length}):**\n\n${missing.map((r, i) => `${i + 1}. **${r.title}**\n   - ${r.description}\n   - Source: ${r.clause}, Page ${r.page}\n   - Risk: ${r.risk.toUpperCase()}`).join('\n\n')}\n\n> ⚠️ These gaps must be addressed before bid submission. Prioritize critical/mandatory items first.`,
        citations: missing.map(r => ({ document: r.sourceDocument, page: r.page, clause: r.clause })),
      };
    }

    if (q.includes('risk') || q.includes('biggest')) {
      const highRisks = risks.filter(r => r.level === 'high');
      return {
        role: 'assistant',
        content: `**Highest Risk Items (${highRisks.length}):**\n\n${highRisks.map((r, i) => `${i + 1}. **${r.title}**\n   - ${r.description}\n   - Impact: ${r.impact}\n   - Action: ${r.suggestedAction}\n   - Source: ${r.source}`).join('\n\n')}\n\n> The tight submission deadline (6 days) combined with 9 missing requirements creates significant submission risk. Immediate action is recommended.`,
        citations: highRisks.map(r => ({ document: 'Tender_UMIP_2026.pdf', page: 0, clause: r.source })),
      };
    }

    if (q.includes('turnover') || q.includes('financial')) {
      const finReqs = requirements.filter(r => r.category === 'financial');
      return {
        role: 'assistant',
        content: `**Financial Requirements:**\n\n${finReqs.map((r, i) => `${i + 1}. **${r.title}** — ${r.status.toUpperCase()}\n   - Requirement: ${r.threshold || r.description}\n   - Company: ${r.companyValue || 'Not provided'}\n   - Source: ${r.clause}, Page ${r.page}`).join('\n\n')}\n\nThe tender specifies a minimum annual turnover of ₹5 Crore (Clause 4.2, Page 18). The company's verified turnover of ₹7.2 Crore exceeds this threshold.\n\n*Source: Tender_UMIP_2026.pdf, Page 18, Clause 4.2*`,
        citations: [{ document: 'Tender_UMIP_2026.pdf', page: 18, clause: 'Clause 4.2' }],
      };
    }

    if (q.includes('review') || q.includes('human')) {
      const reviewReqs = requirements.filter(r => r.status === 'review');
      return {
        role: 'assistant',
        content: `**Requirements Needing Human Review (${reviewReqs.length}):**\n\n${reviewReqs.map((r, i) => `${i + 1}. **${r.title}**\n   - ${r.aiExplanation}\n   - Source: ${r.clause}, Page ${r.page}\n   - AI Confidence: ${r.confidence}%`).join('\n\n')}\n\n> These items have been flagged by AI analysis but require human verification to confirm compliance status.`,
        citations: reviewReqs.slice(0, 3).map(r => ({ document: r.sourceDocument, page: r.page, clause: r.clause })),
      };
    }

    if (q.includes('deadline') || q.includes('submission')) {
      return {
        role: 'assistant',
        content: `**Submission Timeline:**\n\n- **Tender Released:** 5 Sep 2026\n- **Pre-Bid Meeting:** 10 Sep 2026 (Completed)\n- **Clarification Deadline:** 15 Sep 2026 (Passed)\n- **Site Visit Deadline:** 20 Sep 2026 (2 days)\n- **Bid Submission:** 24 Sep 2026 (**6 days remaining**)\n- **Technical Opening:** 25 Sep 2026\n- **Financial Opening:** 10 Oct 2026\n\n> ⚠️ With 6 days remaining and 9 missing requirements, daily progress reviews are strongly recommended.\n\n*Source: Tender_UMIP_2026.pdf, Section 1 — Schedule of Events*`,
        citations: [{ document: 'Tender_UMIP_2026.pdf', page: 5, clause: 'Section 1' }],
      };
    }

    if (q.includes('three most') || q.includes('unresolved') || q.includes('important')) {
      const critical = requirements.filter(r => r.status === 'missing' && r.mandatory).slice(0, 3);
      return {
        role: 'assistant',
        content: `**Three Most Important Unresolved Requirements:**\n\n${critical.map((r, i) => `### ${i + 1}. ${r.title}\n- **Status:** MISSING | **Risk:** HIGH\n- **Requirement:** ${r.description}\n- **Why Critical:** ${r.aiExplanation}\n- **Source:** ${r.clause}, Page ${r.page}\n- **Action Required:** ${r.category === 'experience' ? 'Upload qualifying project completion certificate' : r.category === 'documentation' ? 'Prepare and upload required document' : 'Provide missing evidence'}`).join('\n\n')}\n\n> These three gaps represent the highest risk to bid eligibility. Address them in order of priority before the submission deadline.\n\n*AI confidence levels: ${critical.map(r => `${r.confidence}%`).join(', ')} — Human verification recommended.*`,
        citations: critical.map(r => ({ document: r.sourceDocument, page: r.page, clause: r.clause })),
      };
    }

    return {
      role: 'assistant',
      content: `Based on the tender analysis for **Urban Mobility Infrastructure Package (TND-2026-UMIP-48C)**:\n\nThe current bid readiness stands at **74%** with:\n- ✓ 64 requirements satisfied\n- ⚠ 14 requirements under review\n- ✕ 9 requirements missing\n\nKey areas of concern:\n1. Only 2 of 3 required project completion certificates uploaded (Clause 6.4, Page 27)\n2. Quality Control Plan not submitted (Clause 8.4, Page 36)\n3. Traffic Management Plan missing (Clause 8.8, Page 38)\n\nWould you like me to elaborate on any specific requirement or risk area?\n\n*Source: Analysis of Tender_UMIP_2026.pdf (86 pages)*`,
      citations: [
        { document: 'Tender_UMIP_2026.pdf', page: 27, clause: 'Clause 6.4' },
        { document: 'Tender_UMIP_2026.pdf', page: 36, clause: 'Clause 8.4' },
      ],
    };
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'answer',
          payload: { question, requirements, risks },
        }),
      });
      const data = await res.json();

      if (data.fallback || data.error) {
        setMessages(prev => [...prev, generateFallbackResponse(question)]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.result }]);
      }
    } catch {
      setMessages(prev => [...prev, generateFallbackResponse(question)]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <Sparkles className="w-5 h-5 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F9]">Lens AI</h1>
          <p className="text-sm text-[#64748B]">Ask questions about the tender with evidence-backed citations</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare className="w-12 h-12 text-[#475569] mb-4" />
            <h3 className="text-lg font-semibold text-[#F1F5F9] mb-2">Ask about this tender</h3>
            <p className="text-sm text-[#64748B] mb-6 max-w-md">
              Every answer includes citations to specific pages, clauses, and documents.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-w-xl">
              {copilotPresets.slice(0, 6).map(preset => (
                <button
                  key={preset}
                  onClick={() => { setInput(preset); inputRef.current?.focus(); }}
                  className="text-left px-4 py-3 bg-[#141B2D] border border-[#1E293B] rounded-xl text-sm text-[#94A3B8] hover:text-[#F1F5F9] hover:border-[#334155] transition-all flex items-center gap-2"
                >
                  <ChevronRight className="w-3 h-3 text-indigo-400 shrink-0" />
                  <span className="line-clamp-2">{preset}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-indigo-600 text-white'
                : 'bg-[#141B2D] border border-[#1E293B] text-[#F1F5F9]'
            }`} style={{ animation: 'fade-in-up 0.3s ease-out' }}>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#1E293B]/50 space-y-1">
                  <p className="text-[10px] text-[#475569] uppercase tracking-wider font-semibold">Sources</p>
                  {msg.citations.map((cite, j) => (
                    <div key={j} className="flex items-center gap-2 text-xs text-[#64748B]">
                      <FileText className="w-3 h-3 text-indigo-400" />
                      <span className="font-mono">{cite.document} · Page {cite.page} · {cite.clause}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#141B2D] border border-[#1E293B] rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
              <span className="text-sm text-[#64748B]">Analyzing tender...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about requirements, risks, deadlines, evidence..."
            className="w-full px-4 py-3 bg-[#141B2D] border border-[#1E293B] rounded-xl text-sm text-[#F1F5F9] placeholder:text-[#475569] outline-none focus:border-indigo-500/50"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-all"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      <p className="text-[10px] text-[#475569] text-center mt-2">
        Lens AI provides decision-support analysis. All findings require human verification.
      </p>
    </div>
  );
}
