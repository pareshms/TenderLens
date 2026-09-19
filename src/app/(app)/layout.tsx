'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useAppState } from '@/lib/store';
import {
  LayoutDashboard, FileText, FolderOpen, Building2, GitBranch,
  Shield, AlertTriangle, CheckSquare, Clock, Activity, Settings,
  Search, Bell, ChevronLeft, Menu, Command, Eye, BarChart3,
  MessageSquare, X, ListChecks, ChevronRight, Gauge, Cpu, Upload
} from 'lucide-react';
import { useState } from 'react';

// ── Sidebar ──────────────────────────────────────────────────────
function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarCollapsed, toggleSidebar, activeTenderId, apiKey } = useAppState();

  const mainNav = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  ];

  const workspaceNav = [
    { label: 'Tenders', icon: FileText, href: '/tenders' },
    { label: 'Documents', icon: FolderOpen, href: '/documents' },
    { label: 'Company Profile', icon: Building2, href: '/company' },
  ];

  const intelligenceNav = [
    { label: 'Requirements', icon: ListChecks, href: activeTenderId ? `/tenders/${activeTenderId}/requirements` : '/tenders' },
    { label: 'Evidence Graph', icon: GitBranch, href: activeTenderId ? `/tenders/${activeTenderId}/evidence-graph` : '/tenders' },
    { label: 'Eligibility', icon: Shield, href: activeTenderId ? `/tenders/${activeTenderId}` : '/tenders' },
    { label: 'Risk Center', icon: AlertTriangle, href: '/risk' },
  ];

  const executionNav = [
    { label: 'Action Plan', icon: CheckSquare, href: '/actions' },
    { label: 'Deadlines', icon: Clock, href: '/deadlines' },
    { label: 'Lens AI', icon: MessageSquare, href: activeTenderId ? `/tenders/${activeTenderId}/copilot` : '/tenders' },
  ];

  const systemNav = [
    { label: 'Audit Log', icon: Activity, href: '/audit' },
    { label: 'Analytics', icon: BarChart3, href: '/analytics' },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  const NavLink = ({ item }: { item: { label: string; icon: React.ElementType; href: string } }) => (
    <button
      onClick={() => router.push(item.href)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive(item.href)
          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
          : 'text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E2842]'
      } ${sidebarCollapsed ? 'justify-center' : ''}`}
      title={sidebarCollapsed ? item.label : undefined}
    >
      <item.icon className="w-4 h-4 shrink-0" />
      {!sidebarCollapsed && <span>{item.label}</span>}
    </button>
  );

  const NavSection = ({ title, items }: { title: string; items: typeof mainNav }) => (
    <div className="mb-6">
      {!sidebarCollapsed && (
        <div className="px-3 mb-2 text-[10px] font-semibold text-[#475569] uppercase tracking-widest">{title}</div>
      )}
      <div className="space-y-0.5">
        {items.map(item => <NavLink key={item.href} item={item} />)}
      </div>
    </div>
  );

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-[#0F1525] border-r border-[#1E293B] z-40 flex flex-col transition-all duration-300 ${
      sidebarCollapsed ? 'w-16' : 'w-[260px]'
    }`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 h-14 border-b border-[#1E293B] shrink-0 ${sidebarCollapsed ? 'px-4 justify-center' : 'px-5'}`}>
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
          <Shield className="w-3.5 h-3.5 text-white" />
        </div>
        {!sidebarCollapsed && (
          <span className="text-sm font-bold text-[#F1F5F9] tracking-tight">TenderLens</span>
        )}
        <button
          onClick={toggleSidebar}
          className={`p-1 rounded-md hover:bg-[#1E2842] text-[#64748B] transition-colors ${sidebarCollapsed ? '' : 'ml-auto'}`}
        >
          {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* AI Status Badge */}
      {!sidebarCollapsed && (
        <div className="mx-4 mt-3 px-3 py-2 bg-gradient-to-r from-emerald-500/10 to-indigo-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-emerald-400 truncate">
              {apiKey ? 'Nemotron AI Connected' : 'Procurement Engine Active'}
            </p>
            <p className="text-[9px] text-[#64748B]">Real-time Evidence Matching</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0">
        <NavSection title="" items={mainNav} />
        <NavSection title="Workspace" items={workspaceNav} />
        <NavSection title="Intelligence" items={intelligenceNav} />
        <NavSection title="Execution" items={executionNav} />
        <NavSection title="System" items={systemNav} />
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="p-4 border-t border-[#1E293B] text-center">
          <p className="text-[10px] text-[#64748B]">TenderLens Enterprise v2.4</p>
          <p className="text-[10px] text-[#475569]">AI Decision Intelligence Engine</p>
        </div>
      )}
    </aside>
  );
}

// ── Top Bar ──────────────────────────────────────────────────────
function TopBar() {
  const { toggleCommandPalette, sidebarCollapsed, tenders, activeTenderId, setActiveTender } = useAppState();
  const router = useRouter();

  return (
    <header className={`fixed top-0 right-0 h-14 bg-[#0A0E1A]/80 backdrop-blur-xl border-b border-[#1E293B] z-30 flex items-center justify-between px-6 transition-all duration-300 ${
      sidebarCollapsed ? 'left-16' : 'left-[260px]'
    }`}>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#141B2D] border border-[#1E293B] rounded-lg text-sm text-[#64748B] hover:text-[#94A3B8] hover:border-[#334155] transition-colors w-60"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="text-xs">Search commands...</span>
          <kbd className="ml-auto text-[10px] font-mono bg-[#1A2238] px-1.5 py-0.5 rounded border border-[#1E293B]">⌘K</kbd>
        </button>

        {/* Quick Active Tender Selector */}
        {tenders.length > 0 && (
          <select
            value={activeTenderId || ''}
            onChange={(e) => {
              setActiveTender(e.target.value);
              router.push(`/tenders/${e.target.value}`);
            }}
            className="hidden md:block max-w-xs bg-[#141B2D] border border-[#1E293B] text-xs text-[#F1F5F9] rounded-lg px-2.5 py-1.5 outline-none focus:border-indigo-500"
          >
            {tenders.map(t => (
              <option key={t.id} value={t.id}>
                {t.title} ({t.tenderId})
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Tender</span>
        </button>

        <div className="w-px h-6 bg-[#1E293B]" />

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
            VM
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium text-[#F1F5F9]">Vikram Mehta</p>
            <p className="text-[10px] text-[#64748B]">Procurement Director</p>
          </div>
        </div>
      </div>
    </header>
  );
}

// ── Command Palette ──────────────────────────────────────────────
function CommandPalette() {
  const { commandPaletteOpen, toggleCommandPalette, activeTenderId } = useAppState();
  const router = useRouter();
  const [query, setQuery] = useState('');

  const commands = [
    { label: 'Go to Dashboard', icon: LayoutDashboard, action: () => router.push('/dashboard') },
    { label: 'View All Tenders', icon: FileText, action: () => router.push('/tenders') },
    { label: 'Open Requirements Analysis', icon: ListChecks, action: () => router.push(activeTenderId ? `/tenders/${activeTenderId}/requirements` : '/tenders') },
    { label: 'Open Evidence Matrix Graph', icon: GitBranch, action: () => router.push(activeTenderId ? `/tenders/${activeTenderId}/evidence-graph` : '/tenders') },
    { label: 'View Risk Assessment Center', icon: AlertTriangle, action: () => router.push('/risk') },
    { label: 'Open Deadlines Timeline', icon: Clock, action: () => router.push('/deadlines') },
    { label: 'Open Priority Action Plan', icon: CheckSquare, action: () => router.push('/actions') },
    { label: 'Launch Nemotron AI Copilot', icon: MessageSquare, action: () => router.push(activeTenderId ? `/tenders/${activeTenderId}/copilot` : '/tenders') },
    { label: 'View Document Vault', icon: FolderOpen, action: () => router.push('/documents') },
    { label: 'Manage Company Baseline Profile', icon: Building2, action: () => router.push('/company') },
    { label: 'View Audit Log', icon: Activity, action: () => router.push('/audit') },
    { label: 'View Analytics', icon: BarChart3, action: () => router.push('/analytics') },
    { label: 'System & AI Settings', icon: Settings, action: () => router.push('/settings') },
  ];

  const filtered = query
    ? commands.filter(c => c.label.toLowerCase().includes(query.toLowerCase()))
    : commands;

  if (!commandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm" onClick={toggleCommandPalette} style={{ animation: 'fade-in 0.15s ease-out' }}>
      <div className="w-[560px] max-w-[90vw] bg-[#141B2D] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()} style={{ animation: 'scale-in 0.2s ease-out' }}>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search commands, pages, intelligence features..."
            className="w-full pl-11 pr-4 py-4 bg-transparent border-b border-[#1E293B] text-[#F1F5F9] text-base outline-none placeholder:text-[#475569]"
            autoFocus
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.map(cmd => (
            <button
              key={cmd.label}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#94A3B8] hover:bg-[#1E2842] hover:text-[#F1F5F9] transition-colors"
              onClick={() => { cmd.action(); toggleCommandPalette(); setQuery(''); }}
            >
              <cmd.icon className="w-4 h-4 text-[#64748B]" />
              {cmd.label}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-[#64748B] py-8">No matching commands</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Toast Container ──────────────────────────────────────────────
function ToastContainer() {
  const { toasts, removeToast } = useAppState();

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 px-4 py-3 bg-[#1A2A4A] border rounded-xl shadow-2xl max-w-sm ${
            toast.type === 'success' ? 'border-emerald-500/40 text-emerald-100' :
            toast.type === 'warning' ? 'border-amber-500/40 text-amber-100' :
            toast.type === 'danger' ? 'border-red-500/40 text-red-100' :
            'border-blue-500/40 text-blue-100'
          }`}
          style={{ animation: 'slide-in-right 0.3s ease-out' }}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === 'success' && <CheckSquare className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
            {toast.type === 'danger' && <X className="w-4 h-4 text-red-400" />}
            {toast.type === 'info' && <Eye className="w-4 h-4 text-blue-400" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#F1F5F9]">{toast.title}</p>
            <p className="text-xs text-[#94A3B8] mt-0.5">{toast.message}</p>
          </div>
          <button onClick={() => removeToast(toast.id)} className="p-1 rounded hover:bg-[#1E2842]">
            <X className="w-3 h-3 text-[#64748B]" />
          </button>
        </div>
      ))}
    </div>
  );
}

// ── App Layout ───────────────────────────────────────────────────
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useAppState();

  return (
    <div className="min-h-screen bg-[#0A0E1A]">
      <Sidebar />
      <TopBar />
      <CommandPalette />
      <ToastContainer />
      <main className={`pt-14 min-h-screen transition-all duration-300 ${
        sidebarCollapsed ? 'ml-16' : 'ml-[260px]'
      }`}>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
