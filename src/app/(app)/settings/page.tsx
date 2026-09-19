'use client';

import { useAppState } from '@/lib/store';
import { Settings, Shield, Key, Bell, Globe, CheckCircle2, RefreshCw, AlertCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  const { apiKey, setApiKey, addToast, resetToDefaultData } = useAppState();
  const [localKey, setLocalKey] = useState(apiKey || '');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleSaveKey = () => {
    setApiKey(localKey);
    addToast({
      type: 'success',
      title: 'API Key Saved',
      message: 'NVIDIA Nemotron key saved to your browser session storage.',
    });
  };

  const handleTestKey = async () => {
    if (!localKey) {
      setTestResult({ success: false, message: 'Please enter an API key to test' });
      return;
    }
    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'answer',
          payload: { question: 'System health check. Respond briefly with OK.' },
          customApiKey: localKey,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setTestResult({ success: false, message: data.message || data.error });
      } else {
        setTestResult({ success: true, message: 'Nemotron 340B connection verified successfully!' });
      }
    } catch (err: any) {
      setTestResult({ success: false, message: err.message || 'Connection failed' });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      <div>
        <h1 className="text-2xl font-bold text-[#F1F5F9]">Workspace Settings</h1>
        <p className="text-sm text-[#64748B] mt-1">Configure your AI model credentials, notifications, and security baseline.</p>
      </div>

      {/* AI Key Box */}
      <div className="bg-[#141B2D] border border-[#1E293B] rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Key className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#F1F5F9]">NVIDIA Nemotron AI Configuration</h3>
              <p className="text-xs text-[#64748B]">Enterprise reasoning for tender extraction and risk assessment</p>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold uppercase tracking-wider rounded-full">
            Active Integration
          </span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-[#64748B] uppercase tracking-wider font-semibold block mb-2">
              Nemotron / NVIDIA NIM API Key
            </label>
            <div className="flex gap-3">
              <input
                type="password"
                value={localKey}
                onChange={e => setLocalKey(e.target.value)}
                placeholder="nvapi-..."
                className="flex-1 px-4 py-2.5 bg-[#0A0E1A] border border-[#1E293B] rounded-xl text-sm text-[#F1F5F9] placeholder:text-[#475569] outline-none focus:border-indigo-500 font-mono"
              />
              <button
                onClick={handleSaveKey}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-xs transition-colors shrink-0"
              >
                Save Key
              </button>
              <button
                onClick={handleTestKey}
                disabled={isTesting}
                className="px-4 py-2.5 bg-[#1A2238] hover:bg-[#1E2842] text-indigo-400 border border-[#1E293B] font-medium rounded-xl text-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                Test Connection
              </button>
            </div>
            <p className="text-[11px] text-[#64748B] mt-2">
              Enter your NVIDIA API Key starting with <code className="text-indigo-400">nvapi-</code>. Key is saved securely in your browser's persistent storage.
            </p>

            {testResult && (
              <div className={`mt-3 p-3 rounded-xl border text-xs flex items-center gap-2 ${
                testResult.success ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-red-500/10 border-red-500/30 text-red-300'
              }`}>
                {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{testResult.message}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs text-[#64748B] uppercase tracking-wider font-semibold block mb-2">Selected Reasoning Engine</label>
            <select className="w-full px-4 py-2.5 bg-[#0A0E1A] border border-[#1E293B] rounded-xl text-sm text-[#F1F5F9] outline-none focus:border-indigo-500">
              <option value="nemotron-340b">NVIDIA Nemotron-4 340B Instruct (High Precision Procurement Engine)</option>
              <option value="llama-nemotron-70b">NVIDIA Llama-3.1-Nemotron-70B (Fast Clause Extraction)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reset & Storage */}
      <div className="bg-[#141B2D] border border-[#1E293B] rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Trash2 className="w-4 h-4 text-red-400" />
          <h3 className="text-base font-semibold text-[#F1F5F9]">Data Management</h3>
        </div>
        <p className="text-xs text-[#94A3B8]">
          Reset all tenders, company baseline profile, and document indices back to clean default state.
        </p>
        <button
          onClick={resetToDefaultData}
          className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Reset Workspace Data
        </button>
      </div>
    </div>
  );
}
