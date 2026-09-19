// ================================================================
// TENDERLENS — Production State Store with LocalStorage & API Key
// Dynamic real-time tender management & AI state engine
// ================================================================

'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import {
  demoTenders, demoRequirements, demoDocuments, demoRisks,
  demoTasks, demoAuditLog, demoDeadlines, demoCompanyProfile,
  demoEvidence,
  type Tender, type Requirement, type TenderDocument, type RiskItem,
  type ActionTask, type AuditEntry, type Deadline, type CompanyProfile,
  type Evidence, type ReviewStatus, type TaskStatus,
} from './data';

interface AppState {
  // Data
  tenders: Tender[];
  requirements: Requirement[];
  documents: TenderDocument[];
  risks: RiskItem[];
  tasks: ActionTask[];
  auditLog: AuditEntry[];
  deadlines: Deadline[];
  companyProfile: CompanyProfile;
  evidence: Evidence[];
  apiKey: string;

  // UI State
  activeTenderId: string | null;
  commandPaletteOpen: boolean;
  selectedRequirementId: string | null;
  sidebarCollapsed: boolean;
  toasts: ToastItem[];

  // Actions
  setApiKey: (key: string) => void;
  setActiveTender: (id: string | null) => void;
  toggleCommandPalette: () => void;
  setSelectedRequirement: (id: string | null) => void;
  toggleSidebar: () => void;
  updateRequirementStatus: (reqId: string, reviewStatus: ReviewStatus) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addAuditEntry: (entry: Omit<AuditEntry, 'id' | 'timestamp'>) => void;
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
  simulateUpload: (reqId: string) => void;
  addTender: (tender: Tender, requirements: Requirement[], risks: RiskItem[], doc?: TenderDocument) => void;
  deleteTender: (id: string) => void;
  updateCompanyProfile: (updated: Partial<CompanyProfile>) => void;
  addDocument: (doc: TenderDocument) => void;
  addTask: (task: Omit<ActionTask, 'id'>) => void;
  resetToDefaultData: () => void;
}

export interface ToastItem {
  id: string;
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  message: string;
}

const AppContext = createContext<AppState | null>(null);

const STORAGE_KEYS = {
  TENDERS: 'tenderlens_tenders_v2',
  REQUIREMENTS: 'tenderlens_requirements_v2',
  DOCUMENTS: 'tenderlens_documents_v2',
  RISKS: 'tenderlens_risks_v2',
  TASKS: 'tenderlens_tasks_v2',
  AUDIT: 'tenderlens_audit_v2',
  DEADLINES: 'tenderlens_deadlines_v2',
  COMPANY: 'tenderlens_company_v2',
  EVIDENCE: 'tenderlens_evidence_v2',
  API_KEY: 'tenderlens_api_key_v2',
  ACTIVE_ID: 'tenderlens_active_id_v2',
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [tenders, setTenders] = useState<Tender[]>(demoTenders);
  const [requirements, setRequirements] = useState<Requirement[]>(demoRequirements);
  const [documents, setDocuments] = useState<TenderDocument[]>(demoDocuments);
  const [risks, setRisks] = useState<RiskItem[]>(demoRisks);
  const [tasks, setTasks] = useState<ActionTask[]>(demoTasks);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(demoAuditLog);
  const [deadlines, setDeadlines] = useState<Deadline[]>(demoDeadlines);
  const [companyProfile, setCompanyProfileState] = useState<CompanyProfile>(demoCompanyProfile);
  const [evidence, setEvidence] = useState<Evidence[]>(demoEvidence);
  const [apiKey, setApiKeyRaw] = useState<string>('');
  const [activeTenderId, setActiveTenderIdState] = useState<string | null>('tnd-001');
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedRequirementId, setSelectedRequirementId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedTenders = localStorage.getItem(STORAGE_KEYS.TENDERS);
      if (savedTenders) setTenders(JSON.parse(savedTenders));

      const savedReqs = localStorage.getItem(STORAGE_KEYS.REQUIREMENTS);
      if (savedReqs) setRequirements(JSON.parse(savedReqs));

      const savedDocs = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (savedDocs) setDocuments(JSON.parse(savedDocs));

      const savedRisks = localStorage.getItem(STORAGE_KEYS.RISKS);
      if (savedRisks) setRisks(JSON.parse(savedRisks));

      const savedTasks = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (savedTasks) setTasks(JSON.parse(savedTasks));

      const savedAudit = localStorage.getItem(STORAGE_KEYS.AUDIT);
      if (savedAudit) setAuditLog(JSON.parse(savedAudit));

      const savedDeadlines = localStorage.getItem(STORAGE_KEYS.DEADLINES);
      if (savedDeadlines) setDeadlines(JSON.parse(savedDeadlines));

      const savedCompany = localStorage.getItem(STORAGE_KEYS.COMPANY);
      if (savedCompany) setCompanyProfileState(JSON.parse(savedCompany));

      const savedEvidence = localStorage.getItem(STORAGE_KEYS.EVIDENCE);
      if (savedEvidence) setEvidence(JSON.parse(savedEvidence));

      const savedKey = localStorage.getItem(STORAGE_KEYS.API_KEY);
      if (savedKey) setApiKeyRaw(savedKey);

      const savedActiveId = localStorage.getItem(STORAGE_KEYS.ACTIVE_ID);
      if (savedActiveId) setActiveTenderIdState(savedActiveId);
    } catch (e) {
      console.warn('Failed to load local storage state:', e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (!isLoaded || typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEYS.TENDERS, JSON.stringify(tenders));
      localStorage.setItem(STORAGE_KEYS.REQUIREMENTS, JSON.stringify(requirements));
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
      localStorage.setItem(STORAGE_KEYS.RISKS, JSON.stringify(risks));
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLog));
      localStorage.setItem(STORAGE_KEYS.DEADLINES, JSON.stringify(deadlines));
      localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(companyProfile));
      localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(evidence));
      localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
      if (activeTenderId) localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, activeTenderId);
    } catch (e) {
      console.warn('Failed to persist state:', e);
    }
  }, [tenders, requirements, documents, risks, tasks, auditLog, deadlines, companyProfile, evidence, apiKey, activeTenderId, isLoaded]);

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
        setSelectedRequirementId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const setApiKey = useCallback((key: string) => {
    setApiKeyRaw(key);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.API_KEY, key);
    }
  }, []);

  const setActiveTender = useCallback((id: string | null) => {
    setActiveTenderIdState(id);
    if (id && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ID, id);
    }
  }, []);

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addAuditEntry = useCallback((entry: Omit<AuditEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditEntry = {
      ...entry,
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setAuditLog(prev => [newEntry, ...prev]);
  }, []);

  const addTender = useCallback((
    tender: Tender,
    newRequirements: Requirement[],
    newRisks: RiskItem[],
    doc?: TenderDocument
  ) => {
    setTenders(prev => [tender, ...prev]);
    setRequirements(prev => [...newRequirements, ...prev]);
    setRisks(prev => [...newRisks, ...prev]);
    if (doc) {
      setDocuments(prev => [doc, ...prev]);
    }
    setActiveTenderIdState(tender.id);

    addAuditEntry({
      action: 'Tender Processed',
      detail: `Parsed and indexed "${tender.title}" (${tender.totalRequirements} requirements found).`,
      actor: 'ai',
      tenderId: tender.id,
      icon: 'brain',
    });

    addToast({
      type: 'success',
      title: 'Tender Analysis Complete',
      message: `Successfully analyzed ${tender.title}. ${newRequirements.length} requirements extracted.`,
    });
  }, [addAuditEntry, addToast]);

  const deleteTender = useCallback((id: string) => {
    setTenders(prev => prev.filter(t => t.id !== id));
    setRequirements(prev => prev.filter(r => r.sourceDocument !== id));
    if (activeTenderId === id) {
      const remaining = tenders.filter(t => t.id !== id);
      setActiveTenderIdState(remaining[0]?.id || null);
    }
    addToast({
      type: 'info',
      title: 'Tender Deleted',
      message: 'Tender record and associated requirements removed.',
    });
  }, [activeTenderId, tenders, addToast]);

  const updateCompanyProfile = useCallback((updated: Partial<CompanyProfile>) => {
    setCompanyProfileState(prev => ({ ...prev, ...updated }));
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Company baseline data updated successfully.',
    });
  }, [addToast]);

  const addDocument = useCallback((doc: TenderDocument) => {
    setDocuments(prev => [doc, ...prev]);
    addToast({
      type: 'success',
      title: 'Document Added',
      message: `${doc.name} uploaded and indexed.`,
    });
  }, [addToast]);

  const addTask = useCallback((taskData: Omit<ActionTask, 'id'>) => {
    const newTask: ActionTask = {
      ...taskData,
      id: `task-${Date.now()}`,
    };
    setTasks(prev => [newTask, ...prev]);
    addToast({
      type: 'success',
      title: 'Task Created',
      message: `Action item "${newTask.title}" added to plan.`,
    });
  }, [addToast]);

  const updateRequirementStatus = useCallback((reqId: string, reviewStatus: ReviewStatus) => {
    setRequirements(prev => prev.map(r => {
      if (r.id === reqId) {
        const newStatus = reviewStatus === 'approved' ? 'satisfied' as const : r.status;
        return { ...r, reviewStatus, status: newStatus };
      }
      return r;
    }));
    addAuditEntry({
      action: `Requirement ${reviewStatus === 'approved' ? 'Approved' : reviewStatus === 'rejected' ? 'Rejected' : 'Updated'}`,
      detail: `Requirement ${reqId} review status changed to ${reviewStatus}`,
      actor: 'user',
      tenderId: activeTenderId || undefined,
      icon: reviewStatus === 'approved' ? 'check-circle' : 'x-circle',
    });
    addToast({
      type: reviewStatus === 'approved' ? 'success' : 'info',
      title: `Requirement ${reviewStatus === 'approved' ? 'Approved' : 'Updated'}`,
      message: `Review status updated to ${reviewStatus}`,
    });
  }, [activeTenderId, addAuditEntry, addToast]);

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
    addAuditEntry({
      action: 'Task Updated',
      detail: `Task ${taskId} status changed to ${status}`,
      actor: 'user',
      tenderId: activeTenderId || undefined,
      icon: status === 'completed' ? 'check-circle' : 'play',
    });
  }, [activeTenderId, addAuditEntry]);

  const simulateUpload = useCallback((reqId: string) => {
    setRequirements(prev => prev.map(r => {
      if (r.id === reqId && r.status === 'missing') {
        return { ...r, status: 'satisfied' as const, confidence: 94, reviewStatus: 'pending' as const, companyValue: 'Newly verified evidence document' };
      }
      return r;
    }));

    setTenders(prev => prev.map(t => {
      if (t.id === activeTenderId) {
        const newSatisfied = t.satisfiedRequirements + 1;
        const newMissing = Math.max(0, t.missingRequirements - 1);
        const newReadiness = Math.round((newSatisfied / t.totalRequirements) * 100);
        return { ...t, satisfiedRequirements: newSatisfied, missingRequirements: newMissing, readiness: newReadiness };
      }
      return t;
    }));

    addAuditEntry({
      action: 'Evidence Uploaded',
      detail: `New evidence document uploaded for requirement ${reqId}. Readiness updated.`,
      actor: 'user',
      tenderId: activeTenderId || undefined,
      icon: 'upload',
    });

    addToast({
      type: 'success',
      title: 'Evidence Processed',
      message: 'Document analyzed. Requirement updated to satisfied and readiness score updated.',
    });
  }, [activeTenderId, addAuditEntry, addToast]);

  const resetToDefaultData = useCallback(() => {
    setTenders(demoTenders);
    setRequirements(demoRequirements);
    setDocuments(demoDocuments);
    setRisks(demoRisks);
    setTasks(demoTasks);
    setAuditLog(demoAuditLog);
    setDeadlines(demoDeadlines);
    setCompanyProfileState(demoCompanyProfile);
    setEvidence(demoEvidence);
    setActiveTenderIdState('tnd-001');
    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    }
    addToast({
      type: 'info',
      title: 'Data Reset',
      message: 'Reset data store to clean initial state.',
    });
  }, [addToast]);

  const value: AppState = {
    tenders, requirements, documents, risks, tasks, auditLog, deadlines,
    companyProfile, evidence, apiKey, activeTenderId, commandPaletteOpen,
    selectedRequirementId, sidebarCollapsed, toasts,
    setApiKey, setActiveTender,
    toggleCommandPalette: () => setCommandPaletteOpen(prev => !prev),
    setSelectedRequirement: setSelectedRequirementId,
    toggleSidebar: () => setSidebarCollapsed(prev => !prev),
    updateRequirementStatus, updateTaskStatus, addAuditEntry, addToast, removeToast,
    simulateUpload, addTender, deleteTender, updateCompanyProfile, addDocument, addTask,
    resetToDefaultData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppState must be used within AppProvider');
  return ctx;
}
