import React, { useState } from 'react';
import { Badge, Modal, Input, Select, SectionHeader, formatCurrency, formatDate } from '../components/UI/index.jsx';
import { ONBOARDING as INITIAL_ONBOARDING, WORKERS as INITIAL_WORKERS, COMPANY } from '../data/dummyData.js';

const SKILLS = ['Welding', 'Fitter', 'Electrician', 'Helper', 'Painter', 'CNC Operator', 'Turner', 'Forklift Operator', 'Quality Inspector'];
const DEPARTMENTS = ['Assembly', 'Fabrication', 'Electrical', 'General', 'Finishing', 'Machining', 'Logistics', 'Quality'];

const STEP_TITLES = [
  { id: 1, title: 'Basic Info', icon: '👤' },
  { id: 2, title: 'Documents', icon: '📄' },
  { id: 3, title: 'Medical', icon: '🏥' },
  { id: 4, title: 'Police Check', icon: '🛡️' },
  { id: 5, title: 'Final Review', icon: '✅' },
];

export default function Onboarding() {
  const [onboardingList, setOnboardingList] = useState(INITIAL_ONBOARDING);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [showSendModal, setShowSendModal] = useState(false);
  const [showPreviewForm, setShowPreviewForm] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activationSuccess, setActivationSuccess] = useState('');

  // Digital Form Share Link
  const shareToken = "TKN-2847";
  const shareUrl = `https://app.sonalienterprises.in/onboard/${shareToken}`;

  const filtered = onboardingList.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.phone.includes(searchQuery) || item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'All' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleStartNew = () => {
    const newId = `ONB-2025-${String(onboardingList.length + 1).padStart(3, '0')}`;
    const newRecord = {
      id: newId,
      name: '',
      phone: '',
      address: '',
      dob: '',
      gender: 'Male',
      emergencyName: '',
      emergencyPhone: '',
      skill: 'Welding',
      expectedWage: 750,
      department: 'Assembly',
      currentStep: 1,
      status: 'In Progress',
      daysStarted: 1,
      startDate: new Date().toISOString().split('T')[0],
      documents: {
        aadhaar: 'Pending',
        pan: 'Pending',
        photo: 'Pending',
        passbook: 'Pending',
        experience: 'Pending',
      },
      medical: {
        date: new Date().toISOString().split('T')[0],
        center: 'Apex Occupational Health Center, Chinchwad',
        result: 'Pending',
        remarks: '',
      },
      police: {
        submittedDate: new Date().toISOString().split('T')[0],
        refNo: `PUN-POL-2025-${Math.floor(1000 + Math.random() * 9000)}`,
        status: 'Pending',
      }
    };
    setSelectedRecord(newRecord);
    setCurrentStep(1);
  };

  const handleSelectRecord = (rec) => {
    setSelectedRecord(rec);
    setCurrentStep(rec.currentStep || 1);
  };

  const updateRecordField = (updater) => {
    setSelectedRecord(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      setOnboardingList(list => list.map(item => item.id === updated.id ? updated : item));
      return updated;
    });
  };

  const handleDocToggle = (docKey) => {
    const docStates = ['Pending', 'Uploaded', 'Verified'];
    const current = selectedRecord.documents[docKey] || 'Pending';
    const next = docStates[(docStates.indexOf(current) + 1) % docStates.length];
    updateRecordField(prev => ({
      ...prev,
      documents: { ...prev.documents, [docKey]: next }
    }));
  };

  const handleMedicalResult = (result) => {
    updateRecordField(prev => {
      const newStatus = result === 'Unfit' ? 'Blocked' : prev.police?.status === 'Rejected' ? 'Blocked' : 'In Progress';
      return {
        ...prev,
        status: newStatus,
        medical: { ...prev.medical, result }
      };
    });
  };

  const handlePoliceStatus = (status) => {
    updateRecordField(prev => {
      const newStatus = status === 'Rejected' ? 'Blocked' : prev.medical?.result === 'Unfit' ? 'Blocked' : 'In Progress';
      return {
        ...prev,
        status: newStatus,
        police: { ...prev.police, status }
      };
    });
  };

  const handleActivateWorker = () => {
    if (!selectedRecord) return;

    const newWorkerId = `SE-${String(INITIAL_WORKERS.length + 1).padStart(3, '0')}`;
    const newWorkerObj = {
      id: newWorkerId,
      name: selectedRecord.name,
      phone: selectedRecord.phone,
      skill: selectedRecord.skill,
      dailyWage: selectedRecord.expectedWage,
      status: 'Active',
      joiningDate: new Date().toISOString().split('T')[0],
      daysWorked: 0,
      department: selectedRecord.department,
    };

    INITIAL_WORKERS.push(newWorkerObj);

    updateRecordField(prev => ({
      ...prev,
      status: 'Activated',
      currentStep: 5,
    }));

    setActivationSuccess(`🎉 Worker ${selectedRecord.name} activated successfully as ${newWorkerId}! Added to Worker Management.`);
    setTimeout(() => setActivationSuccess(''), 5000);
  };

  const isMedicalUnfit = selectedRecord?.medical?.result === 'Unfit';
  const isPoliceRejected = selectedRecord?.police?.status === 'Rejected';
  const isBlocked = isMedicalUnfit || isPoliceRejected;

  const allDocsReady = selectedRecord && Object.entries(selectedRecord.documents)
    .filter(([k]) => k !== 'experience')
    .every(([_, v]) => v === 'Verified' || v === 'Uploaded');

  const medicalReady = selectedRecord?.medical?.result === 'Fit';
  const policeReady = selectedRecord?.police?.status === 'Cleared';
  const canActivate = selectedRecord && selectedRecord.name && allDocsReady && medicalReady && policeReady && selectedRecord.status !== 'Activated';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="pb-20 md:pb-0">
      <SectionHeader
        title="Worker Onboarding"
        subtitle="Manage end-to-end recruitment, document collection, verifications & worker activation"
        action={
          <div className="flex gap-2">
            <button
              className="btn-outline rounded-lg px-3 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              onClick={() => setShowSendModal(true)}
            >
              <span>📲</span> Send Form
            </button>
            <button
              className="btn-gold rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer"
              onClick={handleStartNew}
            >
              <span>+</span> New Onboarding
            </button>
          </div>
        }
      />

      {activationSuccess && (
        <div className="glass-card rounded-xl p-4 mb-5 border-l-4 border-l-emerald-500 bg-emerald-50 text-emerald-800 font-semibold text-xs fade-in flex items-center justify-between">
          <span>{activationSuccess}</span>
          <button onClick={() => setActivationSuccess('')} className="text-emerald-700 font-bold ml-2">×</button>
        </div>
      )}

      {/* Main Container: List view or Active Stepper */}
      {!selectedRecord ? (
        <>
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5 fade-in-1">
            <div className="flex-1">
              <input
                className="form-input rounded-xl px-4 py-2.5 text-xs w-full bg-white border border-slate-300 text-slate-900"
                placeholder="🔍 Search candidate by name, phone, or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['All', 'In Progress', 'Blocked', 'Completed', 'Activated'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filterStatus === s ? 'bg-slate-900 text-white shadow-xs' : 'btn-outline'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Onboarding List Table */}
          <div className="glass-card rounded-xl overflow-hidden border border-slate-200 bg-white fade-in-2">
            <div className="overflow-x-auto">
              <table className="data-table w-full min-w-[700px]">
                <thead>
                  <tr>
                    <th className="text-left">Candidate Name</th>
                    <th className="text-left">Phone & Role</th>
                    <th className="text-center">Current Step</th>
                    <th className="text-center">Overall Status</th>
                    <th className="text-right">Started</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-slate-400 text-xs font-medium">
                        No onboarding records found
                      </td>
                    </tr>
                  ) : filtered.map(rec => (
                    <tr key={rec.id} className="cursor-pointer hover:bg-slate-50" onClick={() => handleSelectRecord(rec)}>
                      <td>
                        <div className="font-bold text-slate-900 text-xs">{rec.name || 'Unnamed Candidate'}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{rec.id}</div>
                      </td>
                      <td>
                        <div className="text-xs text-slate-800 font-semibold">{rec.skill}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{rec.phone}</div>
                      </td>
                      <td className="text-center font-medium text-xs">
                        <span className="bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-slate-700 text-[11px]">
                          Step {rec.currentStep || 1}/5: {STEP_TITLES[(rec.currentStep || 1) - 1]?.title}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${
                          rec.status === 'Activated' ? 'badge-green' :
                          rec.status === 'Completed' ? 'badge-green' :
                          rec.status === 'Blocked' ? 'badge-red' : 'badge-yellow'
                        }`}>
                          {rec.status}
                        </span>
                      </td>
                      <td className="text-right text-xs font-medium text-slate-500">
                        {rec.daysStarted} days ago
                      </td>
                      <td className="text-center" onClick={e => e.stopPropagation()}>
                        <button
                          className="btn-gold rounded-lg px-3 py-1 text-xs font-bold"
                          onClick={() => handleSelectRecord(rec)}
                        >
                          {rec.status === 'Activated' ? 'View Summary' : 'Continue Stepper →'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* STEPPER VIEW FOR SELECTED CANDIDATE */
        <div className="fade-in">
          {/* Header Action Bar */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedRecord(null)}
              className="text-xs text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1.5 cursor-pointer bg-white border border-slate-300 px-3 py-1.5 rounded-lg shadow-xs"
            >
              ← Back to Onboarding List
            </button>
            <div className="flex items-center gap-2">
              <span className={`badge ${
                selectedRecord.status === 'Activated' ? 'badge-green' :
                selectedRecord.status === 'Completed' ? 'badge-green' :
                selectedRecord.status === 'Blocked' ? 'badge-red' : 'badge-yellow'
              }`}>
                {selectedRecord.status}
              </span>
              <span className="font-mono text-xs text-slate-500 font-bold">{selectedRecord.id}</span>
            </div>
          </div>

          {/* Stepper Progress Bar Header */}
          <div className="glass-card rounded-xl p-4 mb-6 border-t-2 border-t-slate-900 bg-white">
            <div className="grid grid-cols-5 gap-2 text-center">
              {STEP_TITLES.map((step) => {
                const isDone = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all cursor-pointer ${
                      isCurrent ? 'bg-slate-900 text-white font-bold shadow-xs' :
                      isDone ? 'text-emerald-700 hover:bg-slate-50 font-semibold' : 'text-slate-400 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-lg">
                      {isDone ? '✓' : step.icon}
                    </span>
                    <span className="text-[11px] font-medium hidden sm:inline">{step.title}</span>
                  </button>
                );
              })}
            </div>
            <div className="progress-bar mt-3 bg-slate-100">
              <div className="progress-fill bg-slate-900" style={{ width: `${(currentStep / 5) * 100}%` }} />
            </div>
          </div>

          {/* Blocked Alert Banner */}
          {isBlocked && (
            <div className="glass-card rounded-xl p-4 mb-5 border-l-4 border-l-rose-600 bg-rose-50 text-rose-800 font-medium text-xs fade-in">
              <div className="font-bold text-rose-900 text-sm mb-1">⚠ Onboarding Blocked</div>
              {isMedicalUnfit && <div>• Medical verification result is marked as <strong>UNFIT</strong>.</div>}
              {isPoliceRejected && <div>• Police verification result is marked as <strong>REJECTED</strong>.</div>}
              <div className="text-xs text-rose-700 mt-2 font-medium">Clear doctor/police remarks or resolve discrepancies before proceeding to activation.</div>
            </div>
          )}

          {/* STEP 1 CONTENT: BASIC INFO */}
          {currentStep === 1 && (
            <div className="glass-card rounded-xl p-6 fade-in border-t-2 border-t-slate-900 bg-white">
              <h3 className="text-base font-bold text-slate-900 mb-4">Step 1 — Basic Candidate Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Worker Full Name *"
                  placeholder="e.g., Vikram Ramesh More"
                  value={selectedRecord.name}
                  onChange={e => updateRecordField({ name: e.target.value })}
                />
                <Input
                  label="Phone Number *"
                  placeholder="10-digit mobile"
                  value={selectedRecord.phone}
                  onChange={e => updateRecordField({ phone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Input
                  label="Date of Birth"
                  type="date"
                  value={selectedRecord.dob}
                  onChange={e => updateRecordField({ dob: e.target.value })}
                />
                <Select
                  label="Gender"
                  value={selectedRecord.gender}
                  onChange={e => updateRecordField({ gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </Select>
                <Input
                  label="Address in Pune / Native"
                  placeholder="Full residential address"
                  value={selectedRecord.address}
                  onChange={e => updateRecordField({ address: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Emergency Contact Person Name"
                  placeholder="e.g., Ramesh More (Father)"
                  value={selectedRecord.emergencyName}
                  onChange={e => updateRecordField({ emergencyName: e.target.value })}
                />
                <Input
                  label="Emergency Contact Phone"
                  placeholder="10-digit emergency number"
                  value={selectedRecord.emergencyPhone}
                  onChange={e => updateRecordField({ emergencyPhone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Select
                  label="Skill / Role Applied"
                  value={selectedRecord.skill}
                  onChange={e => updateRecordField({ skill: e.target.value })}
                >
                  {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
                <Select
                  label="Department"
                  value={selectedRecord.department}
                  onChange={e => updateRecordField({ department: e.target.value })}
                >
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </Select>
                <Input
                  label="Expected Daily Wage (₹)"
                  type="number"
                  value={selectedRecord.expectedWage}
                  onChange={e => updateRecordField({ expectedWage: Number(e.target.value) })}
                />
              </div>

              <div className="flex justify-end">
                <button
                  className="btn-gold rounded-lg px-6 py-2.5 text-xs font-bold cursor-pointer"
                  onClick={() => {
                    updateRecordField({ currentStep: 2 });
                    setCurrentStep(2);
                  }}
                >
                  Save & Proceed to Documents →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 CONTENT: DOCUMENTS */}
          {currentStep === 2 && (
            <div className="glass-card rounded-xl p-6 fade-in border-t-2 border-t-slate-900 bg-white">
              <h3 className="text-base font-bold text-slate-900 mb-1">Step 2 — Document Collection Checklist</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">Verify or upload candidate KYC and banking documentation</p>

              <div className="flex flex-col gap-3 mb-6">
                {[
                  { key: 'aadhaar', label: 'Aadhaar Card (Mandatory KYC)' },
                  { key: 'pan', label: 'PAN Card (Tax Verification)' },
                  { key: 'photo', label: 'Passport Size Photograph' },
                  { key: 'passbook', label: 'Bank Passbook / Cancelled Cheque' },
                  { key: 'experience', label: 'Previous Work Experience Letter (Optional)' },
                ].map(doc => {
                  const status = selectedRecord.documents?.[doc.key] || 'Pending';
                  return (
                    <div key={doc.key} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                      <div>
                        <div className="text-xs font-bold text-slate-900">{doc.label}</div>
                        <div className="text-[11px] text-slate-500 font-medium">Click button to toggle status</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`badge ${
                          status === 'Verified' ? 'badge-green' :
                          status === 'Uploaded' ? 'badge-blue' : 'badge-gray'
                        }`}>
                          {status}
                        </span>
                        <button
                          className="btn-outline rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer"
                          onClick={() => handleDocToggle(doc.key)}
                        >
                          Change Status
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <button
                  className="btn-outline rounded-lg px-4 py-2 text-xs font-bold cursor-pointer"
                  onClick={() => setCurrentStep(1)}
                >
                  ← Back to Step 1
                </button>
                <button
                  className="btn-gold rounded-lg px-6 py-2.5 text-xs font-bold cursor-pointer"
                  onClick={() => {
                    updateRecordField({ currentStep: 3 });
                    setCurrentStep(3);
                  }}
                >
                  Proceed to Medical Check →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 CONTENT: MEDICAL VERIFICATION */}
          {currentStep === 3 && (
            <div className="glass-card rounded-xl p-6 fade-in border-t-2 border-t-slate-900 bg-white">
              <h3 className="text-base font-bold text-slate-900 mb-1">Step 3 — Occupational Medical Verification</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">Industrial health assessment for workshop deployment</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Medical Test Date"
                  type="date"
                  value={selectedRecord.medical?.date || ''}
                  onChange={e => updateRecordField(prev => ({ ...prev, medical: { ...prev.medical, date: e.target.value } }))}
                />
                <Input
                  label="Medical Examination Center Name"
                  value={selectedRecord.medical?.center || ''}
                  onChange={e => updateRecordField(prev => ({ ...prev, medical: { ...prev.medical, center: e.target.value } }))}
                />
              </div>

              <div className="mb-4">
                <div className="text-xs text-slate-500 font-semibold tracking-wide mb-2">Medical Fitness Result *</div>
                <div className="flex gap-3">
                  {['Fit', 'Unfit', 'Pending'].map(res => (
                    <button
                      key={res}
                      onClick={() => handleMedicalResult(res)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        selectedRecord.medical?.result === res
                          ? res === 'Fit' ? 'bg-emerald-600 text-white'
                            : res === 'Unfit' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                          : 'btn-outline'
                      }`}
                    >
                      {res === 'Fit' ? '✓ Fit' : res === 'Unfit' ? '⚠ Unfit' : '⏳ Pending'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <Input
                  label="Doctor Remarks / Medical Notes"
                  placeholder="Enter medical observations, BP levels, vision test status..."
                  value={selectedRecord.medical?.remarks || ''}
                  onChange={e => updateRecordField(prev => ({ ...prev, medical: { ...prev.medical, remarks: e.target.value } }))}
                />
              </div>

              <div className="flex justify-between">
                <button
                  className="btn-outline rounded-lg px-4 py-2 text-xs font-bold cursor-pointer"
                  onClick={() => setCurrentStep(2)}
                >
                  ← Back to Step 2
                </button>
                <button
                  disabled={isMedicalUnfit}
                  className="btn-gold rounded-lg px-6 py-2.5 text-xs font-bold cursor-pointer"
                  onClick={() => {
                    updateRecordField({ currentStep: 4 });
                    setCurrentStep(4);
                  }}
                >
                  Proceed to Police Verification →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 CONTENT: POLICE VERIFICATION */}
          {currentStep === 4 && (
            <div className="glass-card rounded-xl p-6 fade-in border-t-2 border-t-slate-900 bg-white">
              <h3 className="text-base font-bold text-slate-900 mb-1">Step 4 — Police Verification & Clearance</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">Background check for security clearance at Tata Motors MIDC site</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Verification Form Submitted Date"
                  type="date"
                  value={selectedRecord.police?.submittedDate || ''}
                  onChange={e => updateRecordField(prev => ({ ...prev, police: { ...prev.police, submittedDate: e.target.value } }))}
                />
                <Input
                  label="Police Acknowledgement / Reference No."
                  value={selectedRecord.police?.refNo || ''}
                  onChange={e => updateRecordField(prev => ({ ...prev, police: { ...prev.police, refNo: e.target.value } }))}
                />
              </div>

              <div className="mb-6">
                <div className="text-xs text-slate-500 font-semibold tracking-wide mb-2">Police Background Check Status *</div>
                <div className="flex gap-3">
                  {['Cleared', 'Pending', 'Rejected'].map(st => (
                    <button
                      key={st}
                      onClick={() => handlePoliceStatus(st)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                        selectedRecord.police?.status === st
                          ? st === 'Cleared' ? 'bg-emerald-600 text-white'
                            : st === 'Rejected' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
                          : 'btn-outline'
                      }`}
                    >
                      {st === 'Cleared' ? '✓ Cleared' : st === 'Rejected' ? '⚠ Rejected' : '⏳ Pending'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  className="btn-outline rounded-lg px-4 py-2 text-xs font-bold cursor-pointer"
                  onClick={() => setCurrentStep(3)}
                >
                  ← Back to Step 3
                </button>
                <button
                  disabled={isBlocked}
                  className="btn-gold rounded-lg px-6 py-2.5 text-xs font-bold cursor-pointer"
                  onClick={() => {
                    updateRecordField({ currentStep: 5 });
                    setCurrentStep(5);
                  }}
                >
                  Proceed to Final Review →
                </button>
              </div>
            </div>
          )}

          {/* STEP 5 CONTENT: FINAL REVIEW & ACTIVATION */}
          {currentStep === 5 && (
            <div className="glass-card rounded-xl p-6 fade-in border-t-2 border-t-slate-900 bg-white">
              <h3 className="text-base font-bold text-slate-900 mb-1">Step 5 — Final Review & Worker Activation</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">Verify overall onboarding checklist before releasing worker ID</p>

              {/* Summary Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="glass-card rounded-xl p-4 bg-slate-50 border-slate-200">
                  <div className="text-[11px] text-slate-500 font-bold uppercase mb-2">Candidate Details</div>
                  <div className="text-xs font-bold text-slate-900">{selectedRecord.name || 'N/A'}</div>
                  <div className="text-xs text-slate-600 font-medium mt-1">Role: {selectedRecord.skill} · {selectedRecord.department}</div>
                  <div className="text-xs text-slate-600 font-medium font-mono">Wage: {formatCurrency(selectedRecord.expectedWage)} / day</div>
                </div>

                <div className="glass-card rounded-xl p-4 bg-slate-50 border-slate-200">
                  <div className="text-[11px] text-slate-500 font-bold uppercase mb-2">Clearance Audit</div>
                  <div className="flex flex-col gap-1.5 text-xs font-medium">
                    <div className="flex justify-between">
                      <span>KYC Documents:</span>
                      <span className={allDocsReady ? 'text-emerald-700 font-bold' : 'text-amber-700 font-bold'}>
                        {allDocsReady ? '✓ Complete' : '⚠ Incomplete'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Medical Verification:</span>
                      <span className={selectedRecord.medical?.result === 'Fit' ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                        {selectedRecord.medical?.result || 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Police Check:</span>
                      <span className={selectedRecord.police?.status === 'Cleared' ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>
                        {selectedRecord.police?.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-slate-900">System Status</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">
                    {canActivate ? 'All compliance requirements passed. Worker is ready for deployment.' : 'Complete pending items above to activate worker.'}
                  </div>
                </div>
                {selectedRecord.status === 'Activated' ? (
                  <span className="text-emerald-800 font-bold text-xs bg-emerald-100 border border-emerald-300 px-4 py-2 rounded-lg">
                    ✓ Worker Activated & Added to System
                  </span>
                ) : (
                  <button
                    disabled={!canActivate}
                    onClick={handleActivateWorker}
                    className="btn-gold rounded-lg px-6 py-2.5 text-xs font-bold cursor-pointer"
                  >
                    🚀 Activate Worker Now
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SHARE / SEND ONBOARDING FORM MODAL */}
      <Modal isOpen={showSendModal} onClose={() => setShowSendModal(false)} title="Send Digital Onboarding Form" width="max-w-lg">
        <div className="flex flex-col gap-4">
          <p className="text-xs text-slate-500 font-medium">Send this self-service link to candidate to complete their KYC & details on smartphone</p>

          <div className="rounded-xl p-3 bg-slate-100 border border-slate-200 font-mono text-xs text-slate-800 flex justify-between items-center">
            <span className="truncate mr-2 font-bold">{shareUrl}</span>
            <button className="btn-gold px-3 py-1 rounded text-xs font-bold cursor-pointer" onClick={handleCopy}>
              {copiedLink ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Hello! Please fill out your Sonali Enterprises worker onboarding form here: ${shareUrl}`)}`}
              target="_blank"
              rel="noreferrer"
              className="btn-gold rounded-lg px-4 py-2.5 text-xs font-bold text-center flex items-center justify-center gap-2"
            >
              <span>💬</span> WhatsApp Share
            </a>
            <button
              className="btn-outline rounded-lg px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
              onClick={() => { setShowSendModal(false); setShowPreviewForm(true); }}
            >
              <span>📱</span> Preview Form UI
            </button>
          </div>
        </div>
      </Modal>

      {/* WORKER SELF-SERVICE MOBILE FORM PREVIEW MODAL */}
      <Modal isOpen={showPreviewForm} onClose={() => setShowPreviewForm(false)} title="Worker Mobile Self-Service Form (Preview)" width="max-w-md">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-900 max-h-[75vh] overflow-y-auto">
          <div className="text-center pb-4 border-b border-slate-200 mb-4">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white font-bold mx-auto flex items-center justify-center text-xs mb-2 font-mono">SE</div>
            <h4 className="font-bold text-slate-900 text-base">Sonali Enterprises</h4>
            <p className="text-[11px] text-slate-500 font-medium">Labour Contractor · Pune</p>
          </div>

          <div className="flex flex-col gap-3 text-left">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-widest">Candidate Registration</div>
            <Input label="Your Name *" placeholder="Enter full name" />
            <Input label="Mobile Number *" placeholder="Enter mobile number" />
            <Input label="Aadhaar Card No. *" placeholder="12-digit Aadhaar number" />
            <Input label="Bank Account No." placeholder="Enter account number" />
            <Input label="IFSC Code" placeholder="e.g. SBIN0001234" />
            <Select label="Trade / Skill">
              {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>

            <button className="btn-gold rounded-lg py-2.5 text-xs font-bold w-full mt-2 cursor-pointer" onClick={() => setShowPreviewForm(false)}>
              Submit Onboarding Info
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
