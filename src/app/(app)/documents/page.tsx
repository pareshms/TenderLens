'use client';
import { useAppState } from '@/lib/store';
import { FileText, Upload, CheckCircle2, Clock, Search } from 'lucide-react';

export default function DocumentsPage() {
  const { documents } = useAppState();
  const typeColors: Record<string, string> = {
    tender: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    financial: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    experience: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    technical: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    legal: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    certificate: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    registration: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    other: 'text-[#64748B] bg-[#1E293B] border-[#334155]',
  };

  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <FileText className="w-12 h-12 text-[#475569] mb-4" />
        <h2 className="text-xl font-bold text-[#F1F5F9] mb-2">Document Center</h2>
        <p className="text-[#94A3B8] mb-6">Upload tender and company documents to begin analysis.</p>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium"><Upload className="w-4 h-4" /> Upload Documents</button>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F9]">Document Center</h1>
          <p className="text-sm text-[#64748B] mt-1">{documents.length} documents · {documents.reduce((s, d) => s + d.evidenceCount, 0)} evidence items extracted</p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all">
          <Upload className="w-4 h-4" /> Upload
        </button>
      </div>

      <div className="bg-[#141B2D] border border-[#1E293B] rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#0F1525]">
              <th className="text-left px-6 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Document</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Type</th>
              <th className="text-center px-4 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Pages</th>
              <th className="text-center px-4 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Evidence</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Status</th>
              <th className="text-left px-4 py-3 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">Size</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, i) => (
              <tr key={doc.id} className="border-t border-[#1E293B]/50 hover:bg-[#1E2842]/50 transition-colors" style={{ animation: `fade-in-up 0.3s ease-out ${i * 0.03}s both` }}>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-[#64748B]" />
                    <span className="text-sm font-medium text-[#F1F5F9]">{doc.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${typeColors[doc.type]}`}>{doc.type}</span>
                </td>
                <td className="px-4 py-3 text-center text-sm text-[#94A3B8] tabular-nums">{doc.pages}</td>
                <td className="px-4 py-3 text-center text-sm text-[#94A3B8] tabular-nums">{doc.evidenceCount}</td>
                <td className="px-4 py-3">
                  {doc.processed ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 className="w-3 h-3" /> Processed</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-400"><Clock className="w-3 h-3" /> Processing</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-[#64748B]">{doc.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
