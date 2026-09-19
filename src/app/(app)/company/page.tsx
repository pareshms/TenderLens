'use client';

import { useAppState } from '@/lib/store';
import { Building2, MapPin, Award, Briefcase, Users, DollarSign, Plus, CheckCircle2, Edit3, Save, X } from 'lucide-react';
import { useState } from 'react';

export default function CompanyProfilePage() {
  const { companyProfile, updateCompanyProfile, addToast } = useAppState();
  const p = companyProfile;

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: p.name,
    industry: p.industry,
    annualTurnover: p.annualTurnover,
    yearsInOperation: p.yearsInOperation,
    employees: p.employees,
    gstNumber: p.gstNumber,
    panNumber: p.panNumber,
  });

  const [newCert, setNewCert] = useState('');
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProj, setNewProj] = useState({
    name: '',
    client: '',
    value: '',
    nature: 'Infrastructure',
    status: 'completed' as const,
  });

  const handleSaveOverview = () => {
    updateCompanyProfile(formData);
    setIsEditing(false);
  };

  const handleAddCert = () => {
    if (!newCert.trim()) return;
    updateCompanyProfile({
      certifications: [...p.certifications, newCert.trim()],
    });
    setNewCert('');
  };

  const handleAddProject = () => {
    if (!newProj.name.trim() || !newProj.value.trim()) return;
    const projectItem = {
      id: `proj-${Date.now()}`,
      name: newProj.name,
      client: newProj.client || 'Public Client',
      value: newProj.value,
      completionDate: new Date().toISOString().split('T')[0],
      nature: newProj.nature,
      status: newProj.status,
      certificateUploaded: true,
    };
    updateCompanyProfile({
      pastProjects: [projectItem, ...p.pastProjects],
    });
    setNewProj({ name: '', client: '', value: '', nature: 'Infrastructure', status: 'completed' });
    setShowAddProject(false);
  };

  return (
    <div className="space-y-8 max-w-4xl" style={{ animation: 'fade-in-up 0.5s ease-out' }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#F1F5F9]">Company Baseline Profile</h1>
          <p className="text-sm text-[#64748B] mt-1">Grounding evidence baseline used by Nemotron AI for automated eligibility matching.</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 bg-[#1A2238] hover:bg-[#1E2842] text-indigo-400 border border-[#1E293B] rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
          {isEditing ? 'Cancel Editing' : 'Edit Company Baseline'}
        </button>
      </div>

      {/* Overview */}
      <div className="bg-[#141B2D] border border-[#1E293B] rounded-2xl p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/10 border border-indigo-500/20">
              <Building2 className="w-7 h-7 text-indigo-400" />
            </div>
            {isEditing ? (
              <div className="space-y-2 flex-1">
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-1.5 bg-[#0A0E1A] border border-[#1E293B] rounded-lg text-lg font-bold text-[#F1F5F9]"
                />
                <input
                  type="text"
                  value={formData.industry}
                  onChange={e => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full px-3 py-1 bg-[#0A0E1A] border border-[#1E293B] rounded-lg text-xs text-[#94A3B8]"
                />
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-bold text-[#F1F5F9]">{p.name}</h2>
                <p className="text-sm text-[#94A3B8] mt-0.5">{p.industry}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-[#64748B]">
                  <span>GST: <span className="text-[#F1F5F9] font-mono font-medium">{p.gstNumber}</span></span>
                  <span>PAN: <span className="text-[#F1F5F9] font-mono font-medium">{p.panNumber}</span></span>
                </div>
              </div>
            )}
          </div>
          {isEditing && (
            <button
              onClick={handleSaveOverview}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              Save Baseline
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-[#0A0E1A] rounded-xl p-4 border border-[#1E293B]">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">Annual Turnover</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                value={formData.annualTurnover}
                onChange={e => setFormData({ ...formData, annualTurnover: e.target.value })}
                className="w-full px-2 py-1 bg-[#141B2D] border border-[#1E293B] rounded text-sm text-[#F1F5F9]"
              />
            ) : (
              <p className="text-sm font-semibold text-[#F1F5F9]">{p.annualTurnover}</p>
            )}
          </div>

          <div className="bg-[#0A0E1A] rounded-xl p-4 border border-[#1E293B]">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">Years Active</span>
            </div>
            {isEditing ? (
              <input
                type="number"
                value={formData.yearsInOperation}
                onChange={e => setFormData({ ...formData, yearsInOperation: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1 bg-[#141B2D] border border-[#1E293B] rounded text-sm text-[#F1F5F9]"
              />
            ) : (
              <p className="text-sm font-semibold text-[#F1F5F9]">{p.yearsInOperation} Years</p>
            )}
          </div>

          <div className="bg-[#0A0E1A] rounded-xl p-4 border border-[#1E293B]">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">Workforce</span>
            </div>
            {isEditing ? (
              <input
                type="number"
                value={formData.employees}
                onChange={e => setFormData({ ...formData, employees: parseInt(e.target.value) || 0 })}
                className="w-full px-2 py-1 bg-[#141B2D] border border-[#1E293B] rounded text-sm text-[#F1F5F9]"
              />
            ) : (
              <p className="text-sm font-semibold text-[#F1F5F9]">{p.employees} Employees</p>
            )}
          </div>

          <div className="bg-[#0A0E1A] rounded-xl p-4 border border-[#1E293B]">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] text-[#64748B] uppercase tracking-wider font-semibold">Locations</span>
            </div>
            <p className="text-sm font-semibold text-[#F1F5F9] truncate">{p.locations.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* Certifications */}
      <div className="bg-[#141B2D] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-semibold text-[#F1F5F9]">Quality & ISO Certifications</h3>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newCert}
            onChange={e => setNewCert(e.target.value)}
            placeholder="Add new certification (e.g. ISO 27001:2022)..."
            className="flex-1 px-3 py-2 bg-[#0A0E1A] border border-[#1E293B] rounded-xl text-xs text-[#F1F5F9] outline-none focus:border-indigo-500"
          />
          <button
            onClick={handleAddCert}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </div>

        <div className="space-y-2">
          {p.certifications.map((cert, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 bg-[#0A0E1A] rounded-xl border border-[#1E293B]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-sm font-medium text-[#F1F5F9]">{cert}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Past Projects */}
      <div className="bg-[#141B2D] border border-[#1E293B] rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <h3 className="text-base font-semibold text-[#F1F5F9]">Completed & Active Projects</h3>
          </div>
          <button
            onClick={() => setShowAddProject(!showAddProject)}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Project
          </button>
        </div>

        {showAddProject && (
          <div className="p-4 bg-[#0A0E1A] border border-[#1E293B] rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-[#F1F5F9] uppercase tracking-wider">New Project Entry</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                value={newProj.name}
                onChange={e => setNewProj({ ...newProj, name: e.target.value })}
                placeholder="Project Title"
                className="px-3 py-2 bg-[#141B2D] border border-[#1E293B] rounded-lg text-xs text-[#F1F5F9]"
              />
              <input
                type="text"
                value={newProj.client}
                onChange={e => setNewProj({ ...newProj, client: e.target.value })}
                placeholder="Client Authority"
                className="px-3 py-2 bg-[#141B2D] border border-[#1E293B] rounded-lg text-xs text-[#F1F5F9]"
              />
              <input
                type="text"
                value={newProj.value}
                onChange={e => setNewProj({ ...newProj, value: e.target.value })}
                placeholder="Project Value (e.g. ₹15 Crore)"
                className="px-3 py-2 bg-[#141B2D] border border-[#1E293B] rounded-lg text-xs text-[#F1F5F9]"
              />
              <input
                type="text"
                value={newProj.nature}
                onChange={e => setNewProj({ ...newProj, nature: e.target.value })}
                placeholder="Project Nature / Domain"
                className="px-3 py-2 bg-[#141B2D] border border-[#1E293B] rounded-lg text-xs text-[#F1F5F9]"
              />
            </div>
            <button
              onClick={handleAddProject}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              Save Project Entry
            </button>
          </div>
        )}

        <div className="space-y-3">
          {p.pastProjects.map(proj => (
            <div key={proj.id} className="bg-[#0A0E1A] rounded-xl p-4 border border-[#1E293B]">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-[#F1F5F9]">{proj.name}</h4>
                  <p className="text-xs text-[#94A3B8] mt-0.5">{proj.client}</p>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase border ${
                  proj.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                }`}>{proj.status}</span>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-[#64748B]">
                <span>Contract Value: <span className="text-[#F1F5F9] font-medium">{proj.value}</span></span>
                <span>Nature: {proj.nature}</span>
                {proj.certificateUploaded && (
                  <span className="text-emerald-400 flex items-center gap-1 font-medium"><CheckCircle2 className="w-3 h-3" /> Certificate Verified</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
