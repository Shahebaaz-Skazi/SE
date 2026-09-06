import React, { useState } from 'react';
import { Badge, Modal, Input, Select, SectionHeader, formatCurrency, formatDate } from '../components/UI/index.jsx';
import { OFFBOARDING as INITIAL_OFFBOARDING, WORKERS as INITIAL_WORKERS, COMPANY } from '../data/dummyData.js';

const EXIT_TYPES = ['Resignation', 'Contract End', 'Termination', 'Absconding'];

const STEP_TITLES = [
  { id: 1, title: 'Exit Initiation', icon: '📝' },
  { id: 2, title: 'Settlement', icon: '💰' },
  { id: 3, title: 'Clearance', icon: '📋' },
  { id: 4, title: 'Experience Letter', icon: '📜' },
];

export default function Offboarding() {
  const [offboardingList, setOffboardingList] = useState(INITIAL_OFFBOARDING);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Slips
  const [showSettlementSlip, setShowSettlementSlip] = useState(false);
  const [showExpLetter, setShowExpLetter] = useState(false);
  const [offboardSuccess, setOffboardSuccess] = useState('');

  const activeWorkersList = INITIAL_WORKERS.filter(w => w.status === 'Active');

  const filtered = offboardingList.filter(item => {
    const matchSearch = item.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.workerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.exitType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'All' || item.completionStatus === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleInitiateNew = () => {
    const defaultWorker = activeWorkersList[0] || INITIAL_WORKERS[0];
    const newId = `OFF-2025-${String(offboardingList.length + 1).padStart(3, '0')}`;
    const newRec = {
      id: newId,
      workerId: defaultWorker.id,
      workerName: defaultWorker.name,
      skill: defaultWorker.skill,
      department: defaultWorker.department,
      joiningDate: defaultWorker.joiningDate || '2023-01-01',
      exitType: 'Resignation',
      lastDate: new Date().toISOString().split('T')[0],
      reason: 'Personal reasons / Contract end',
      daysWorked: 18,
      dailyWage: defaultWorker.dailyWage,
      pendingWages: 18 * defaultWorker.dailyWage,
      advanceDeductions: 0,
      netSettlement: 18 * defaultWorker.dailyWage,
      settlementStatus: 'Pending',
      completionStatus: 'In Progress',
      clearance: {
        idCard: false,
        uniform: false,
        noDues: false,
        exitInterview: false,
      }
    };
    setSelectedRecord(newRec);
    setCurrentStep(1);
  };

  const handleSelectRecord = (rec) => {
    setSelectedRecord(rec);
    setCurrentStep(1);
  };

  const updateRecordField = (updater) => {
    setSelectedRecord(prev => {
      const updated = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      setOffboardingList(list => list.map(item => item.id === updated.id ? updated : item));
      return updated;
    });
  };

  const handleWorkerSelect = (wId) => {
    const worker = INITIAL_WORKERS.find(w => w.id === wId);
    if (!worker) return;
    const days = 20;
    const pending = days * worker.dailyWage;
    updateRecordField({
      workerId: worker.id,
      workerName: worker.name,
      skill: worker.skill,
      department: worker.department,
      dailyWage: worker.dailyWage,
      joiningDate: worker.joiningDate,
      daysWorked: days,
      pendingWages: pending,
      netSettlement: pending - (selectedRecord?.advanceDeductions || 0),
    });
  };

  const handleClearanceToggle = (key) => {
    updateRecordField(prev => ({
      ...prev,
      clearance: {
        ...prev.clearance,
        [key]: !prev.clearance?.[key]
      }
    }));
  };

  const handleCompleteOffboarding = () => {
    if (!selectedRecord) return;

    // Set worker to Inactive in WORKERS array
    const targetWorker = INITIAL_WORKERS.find(w => w.id === selectedRecord.workerId);
    if (targetWorker) {
      targetWorker.status = 'Inactive';
    }

    updateRecordField({
      completionStatus: 'Completed',
    });

    setOffboardSuccess(`✓ Offboarding completed for ${selectedRecord.workerName}. Worker status set to Inactive.`);
    setTimeout(() => setOffboardSuccess(''), 5000);
  };

  const isAllClearanceDone = selectedRecord && selectedRecord.clearance?.idCard && selectedRecord.clearance?.uniform && selectedRecord.clearance?.noDues;

  return (
    <div className="pb-20 md:pb-0">
      <SectionHeader
        title="Worker Offboarding"
        subtitle="Manage employee exits, final salary settlements, clearance certificates & service letters"
        action={
          <button
            className="btn-gold rounded-lg px-4 py-2 text-sm font-bold flex items-center gap-2 cursor-pointer shadow-sm"
            onClick={handleInitiateNew}
          >
            <span>+</span> Initiate Offboarding
          </button>
        }
      />

      {offboardSuccess && (
        <div className="glass-card rounded-xl p-4 mb-5 border-l-4 border-l-emerald-600 bg-emerald-50 text-emerald-900 font-semibold text-sm fade-in flex items-center justify-between shadow-sm">
          <span>{offboardSuccess}</span>
          <button onClick={() => setOffboardSuccess('')} className="text-emerald-700 font-bold ml-2">×</button>
        </div>
      )}

      {/* Main Container: List view or Active Stepper */}
      {!selectedRecord ? (
        <>
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-5 fade-in-1">
            <div className="flex-1">
              <input
                className="form-input rounded-xl px-4 py-2.5 text-sm w-full"
                placeholder="🔍 Search offboard record by worker name, ID, or exit type..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['All', 'In Progress', 'Completed'].map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    filterStatus === s ? 'bg-slate-900 text-white font-bold shadow-sm' : 'btn-outline'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Offboarding List Table */}
          <div className="glass-card rounded-xl overflow-hidden border-t-2 border-t-slate-900 fade-in-2 shadow-sm">
            <div className="overflow-x-auto">
              <table className="data-table w-full min-w-[700px]">
                <thead>
                  <tr>
                    <th className="text-left">Worker</th>
                    <th className="text-left">Exit Type</th>
                    <th className="text-right">Last Working Date</th>
                    <th className="text-right">Net Settlement</th>
                    <th className="text-center">Settlement</th>
                    <th className="text-center">Completion</th>
                    <th className="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                        No offboarding records found
                      </td>
                    </tr>
                  ) : filtered.map(rec => (
                    <tr key={rec.id} className="cursor-pointer hover:bg-slate-50/80 transition-colors" onClick={() => handleSelectRecord(rec)}>
                      <td>
                        <div className="font-semibold text-slate-900 text-sm">{rec.workerName}</div>
                        <div className="text-xs text-slate-500 font-mono">{rec.workerId} · {rec.skill}</div>
                      </td>
                      <td className="text-sm font-medium text-slate-700">
                        {rec.exitType}
                      </td>
                      <td className="text-right text-xs font-medium text-slate-600">
                        {formatDate(rec.lastDate)}
                      </td>
                      <td className="text-right text-sm font-bold text-slate-900">
                        {formatCurrency(rec.netSettlement)}
                      </td>
                      <td className="text-center">
                        <span className={`badge ${rec.settlementStatus === 'Paid' ? 'badge-green' : 'badge-amber'}`}>
                          {rec.settlementStatus}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className={`badge ${rec.completionStatus === 'Completed' ? 'badge-green' : 'badge-gray'}`}>
                          {rec.completionStatus}
                        </span>
                      </td>
                      <td className="text-center" onClick={e => e.stopPropagation()}>
                        <button
                          className="btn-gold rounded-lg px-3 py-1 text-xs font-bold shadow-sm"
                          onClick={() => handleSelectRecord(rec)}
                        >
                          View / Process →
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
        /* STEPPER VIEW FOR SELECTED RECORD */
        <div className="fade-in">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setSelectedRecord(null)}
              className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1.5 cursor-pointer bg-white border border-slate-300 px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50"
            >
              ← Back to Offboarding List
            </button>
            <div className="flex items-center gap-2">
              <span className={`badge ${selectedRecord.completionStatus === 'Completed' ? 'badge-green' : 'badge-amber'}`}>
                {selectedRecord.completionStatus}
              </span>
              <span className="font-mono text-xs text-slate-500 font-bold">{selectedRecord.id}</span>
            </div>
          </div>

          {/* Stepper Progress Bar Header */}
          <div className="glass-card rounded-xl p-4 mb-6 border-t-2 border-t-slate-900 shadow-sm">
            <div className="grid grid-cols-4 gap-2 text-center">
              {STEP_TITLES.map((step) => {
                const isDone = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                return (
                  <button
                    key={step.id}
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all cursor-pointer ${
                      isCurrent ? 'bg-slate-900 border border-slate-800 text-white font-bold shadow-sm' :
                      isDone ? 'text-emerald-700 hover:bg-slate-100 font-semibold' : 'text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-lg">
                      {isDone ? '✓' : step.icon}
                    </span>
                    <span className="text-[0.7rem] font-medium hidden sm:inline">{step.title}</span>
                  </button>
                );
              })}
            </div>
            <div className="progress-bar mt-3">
              <div className="progress-fill" style={{ width: `${(currentStep / 4) * 100}%` }} />
            </div>
          </div>

          {/* STEP 1 CONTENT: EXIT INITIATION */}
          {currentStep === 1 && (
            <div className="glass-card rounded-xl p-6 fade-in border-t-2 border-t-slate-900 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Step 1 — Exit Initiation & Reason</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Select
                  label="Select Active Worker *"
                  value={selectedRecord.workerId}
                  onChange={e => handleWorkerSelect(e.target.value)}
                >
                  {INITIAL_WORKERS.map(w => (
                    <option key={w.id} value={w.id}>{w.name} ({w.id}) — {w.skill}</option>
                  ))}
                </Select>
                <Select
                  label="Exit Type *"
                  value={selectedRecord.exitType}
                  onChange={e => updateRecordField({ exitType: e.target.value })}
                >
                  {EXIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  label="Last Working Date *"
                  type="date"
                  value={selectedRecord.lastDate}
                  onChange={e => updateRecordField({ lastDate: e.target.value })}
                />
                <Input
                  label="Days Worked in Final Month"
                  type="number"
                  value={selectedRecord.daysWorked}
                  onChange={e => {
                    const days = Number(e.target.value);
                    const pending = days * selectedRecord.dailyWage;
                    updateRecordField({
                      daysWorked: days,
                      pendingWages: pending,
                      netSettlement: pending - selectedRecord.advanceDeductions,
                    });
                  }}
                />
              </div>

              <div className="mb-6">
                <Input
                  label="Exit Reason / Remarks"
                  placeholder="State reason for resignation, contract expiry details..."
                  value={selectedRecord.reason}
                  onChange={e => updateRecordField({ reason: e.target.value })}
                />
              </div>

              <div className="flex justify-end">
                <button
                  className="btn-gold rounded-lg px-6 py-2.5 text-sm font-bold cursor-pointer shadow-sm"
                  onClick={() => {
                    updateRecordField({ currentStep: 2 });
                    setCurrentStep(2);
                  }}
                >
                  Proceed to Final Settlement →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 CONTENT: FINAL SETTLEMENT */}
          {currentStep === 2 && (
            <div className="glass-card rounded-xl p-6 fade-in border-t-2 border-t-slate-900 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Step 2 — Final Salary Settlement & Deductions</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">Automatic wage calculation for pending working days minus advances</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="glass-card rounded-xl p-4 bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium mb-1">Gross Pending Wages</div>
                  <div className="text-lg font-bold text-slate-900">
                    {formatCurrency(selectedRecord.pendingWages)}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">{selectedRecord.daysWorked} days × {formatCurrency(selectedRecord.dailyWage)}</div>
                </div>

                <div className="glass-card rounded-xl p-4 bg-slate-50 border border-slate-200">
                  <div className="text-xs text-slate-500 font-medium mb-1">Advance Deductions (₹)</div>
                  <input
                    type="number"
                    className="form-input rounded-lg px-3 py-1 text-sm w-full font-bold text-rose-600 bg-white"
                    value={selectedRecord.advanceDeductions}
                    onChange={e => {
                      const adv = Number(e.target.value);
                      updateRecordField({
                        advanceDeductions: adv,
                        netSettlement: selectedRecord.pendingWages - adv,
                      });
                    }}
                  />
                  <div className="text-xs text-slate-500 mt-1">Outstanding advances</div>
                </div>

                <div className="glass-card rounded-xl p-4 bg-emerald-50/60 border border-emerald-200 border-l-4 border-l-emerald-600">
                  <div className="text-xs text-emerald-800 font-medium mb-1">Net Final Settlement</div>
                  <div className="text-xl font-bold text-emerald-700">
                    {formatCurrency(selectedRecord.netSettlement)}
                  </div>
                  <div className="text-xs text-emerald-700/80 mt-1">Payable to worker</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 gap-3 mb-6">
                <div>
                  <div className="text-sm font-bold text-slate-900">Settlement Status</div>
                  <div className="text-xs text-slate-500 font-medium">Mark whether payment has been released to bank</div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateRecordField({ settlementStatus: 'Paid' })}
                    className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      selectedRecord.settlementStatus === 'Paid' ? 'bg-emerald-600 text-white shadow-sm' : 'btn-outline'
                    }`}
                  >
                    ✓ Mark as Paid
                  </button>
                  <button
                    onClick={() => setShowSettlementSlip(true)}
                    className="btn-outline rounded-lg px-4 py-2 text-xs font-bold cursor-pointer"
                  >
                    🧾 Generate Settlement Slip
                  </button>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  className="btn-outline rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer"
                  onClick={() => setCurrentStep(1)}
                >
                  ← Back to Step 1
                </button>
                <button
                  className="btn-gold rounded-lg px-6 py-2.5 text-sm font-bold cursor-pointer shadow-sm"
                  onClick={() => {
                    updateRecordField({ currentStep: 3 });
                    setCurrentStep(3);
                  }}
                >
                  Proceed to Clearance →
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 CONTENT: CLEARANCE */}
          {currentStep === 3 && (
            <div className="glass-card rounded-xl p-6 fade-in border-t-2 border-t-slate-900 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Step 3 — Document Return & Department Clearance</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">Toggle return status of issued tools, IDs, and company property</p>

              <div className="flex flex-col gap-3 mb-6">
                {[
                  { key: 'idCard', label: 'Company ID Card & Gate Pass Returned' },
                  { key: 'uniform', label: 'Uniform, Safety Helmet & PPE Returned' },
                  { key: 'noDues', label: 'No Dues Certificate Signed by Plant Supervisor' },
                  { key: 'exitInterview', label: 'Exit Interview Conducted (Optional)' },
                ].map(item => {
                  const done = selectedRecord.clearance?.[item.key] || false;
                  return (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="text-sm font-semibold text-slate-900">{item.label}</div>
                      <button
                        onClick={() => handleClearanceToggle(item.key)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                          done ? 'bg-emerald-600 text-white shadow-sm' : 'btn-outline'
                        }`}
                      >
                        {done ? '✓ Done' : '⏳ Pending'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <button
                  className="btn-outline rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer"
                  onClick={() => setCurrentStep(2)}
                >
                  ← Back to Step 2
                </button>
                <button
                  className="btn-gold rounded-lg px-6 py-2.5 text-sm font-bold cursor-pointer shadow-sm"
                  onClick={() => {
                    updateRecordField({ currentStep: 4 });
                    setCurrentStep(4);
                  }}
                >
                  Proceed to Experience Letter →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4 CONTENT: EXPERIENCE LETTER & FINALIZATION */}
          {currentStep === 4 && (
            <div className="glass-card rounded-xl p-6 fade-in border-t-2 border-t-slate-900 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Step 4 — Final Status & Experience Certificate</h3>
              <p className="text-xs text-slate-500 mb-6 font-medium">Issue formal service letter and set worker to Inactive in system</p>

              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-sm font-bold text-slate-900">Offboarding Checklist Summary</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {isAllClearanceDone ? '✓ All mandatory clearances verified.' : '⚠ Some clearance items remain pending.'}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowExpLetter(true)}
                    className="btn-gold px-4 py-2 rounded-lg text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>📜</span> View Experience Letter
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-medium">
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Worker:</span>
                    <strong className="text-slate-900">{selectedRecord.workerName}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Exit Type:</span>
                    <strong className="text-slate-900">{selectedRecord.exitType}</strong>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Settlement:</span>
                    <strong className={selectedRecord.settlementStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-600'}>
                      {selectedRecord.settlementStatus} ({formatCurrency(selectedRecord.netSettlement)})
                    </strong>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <span className="text-slate-500 block">Completion:</span>
                    <strong className={selectedRecord.completionStatus === 'Completed' ? 'text-emerald-700' : 'text-slate-700'}>
                      {selectedRecord.completionStatus}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  className="btn-outline rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer"
                  onClick={() => setCurrentStep(3)}
                >
                  ← Back to Step 3
                </button>
                {selectedRecord.completionStatus === 'Completed' ? (
                  <span className="text-emerald-700 font-bold text-sm bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg">
                    ✓ Offboarding Completed & Deactivated
                  </span>
                ) : (
                  <button
                    onClick={handleCompleteOffboarding}
                    className="btn-gold rounded-lg px-6 py-3 text-sm font-bold cursor-pointer shadow-sm"
                  >
                    Complete Offboarding & Deactivate Worker
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* FINAL SETTLEMENT SLIP MODAL */}
      <Modal isOpen={showSettlementSlip} onClose={() => setShowSettlementSlip(false)} title="Final Salary Settlement Slip" width="max-w-xl">
        {selectedRecord && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-slate-800 shadow-md">
            {/* Header */}
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{COMPANY.name}</h2>
                <p className="text-xs text-slate-500 mt-1">{COMPANY.address}</p>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">Settlement Voucher</div>
                <div className="font-mono text-xs text-slate-800 font-bold mt-1">{selectedRecord.id}</div>
                <div className="text-[0.65rem] text-slate-500">Date: {formatDate(selectedRecord.lastDate)}</div>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-xs font-medium">
              <div>
                <span className="text-slate-500 block">Worker Name:</span>
                <span className="font-bold text-slate-900">{selectedRecord.workerName} ({selectedRecord.workerId})</span>
              </div>
              <div>
                <span className="text-slate-500 block">Skill / Trade:</span>
                <span className="text-slate-700">{selectedRecord.skill} ({selectedRecord.department})</span>
              </div>
            </div>

            {/* Table */}
            <table className="data-table w-full mb-6">
              <thead>
                <tr>
                  <th className="text-left">Component</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-slate-700">Earned Wages ({selectedRecord.daysWorked} days @ {formatCurrency(selectedRecord.dailyWage)}/day)</td>
                  <td className="text-right font-bold text-slate-900">{formatCurrency(selectedRecord.pendingWages)}</td>
                </tr>
                <tr>
                  <td className="text-rose-600 font-medium">Less: Salary Advance Deductions</td>
                  <td className="text-right font-bold text-rose-600">- {formatCurrency(selectedRecord.advanceDeductions)}</td>
                </tr>
                <tr className="border-t border-slate-300 font-bold text-sm">
                  <td className="text-emerald-700 py-3">Net Payable Amount</td>
                  <td className="text-right text-emerald-700 py-3 text-base">{formatCurrency(selectedRecord.netSettlement)}</td>
                </tr>
              </tbody>
            </table>

            <div className="flex justify-end gap-3 pt-2">
              <button className="btn-outline px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer" onClick={() => setShowSettlementSlip(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* EXPERIENCE / SERVICE LETTER MODAL */}
      <Modal isOpen={showExpLetter} onClose={() => setShowExpLetter(false)} title="Experience & Service Certificate" width="max-w-2xl">
        {selectedRecord && (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-slate-800 shadow-md">
            {/* Letterhead */}
            <div className="text-center pb-6 border-b-2 border-slate-900 mb-6">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-bold mx-auto flex items-center justify-center text-sm mb-2">SE</div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{COMPANY.name}</h2>
              <p className="text-xs text-slate-600 font-medium mt-1">{COMPANY.address} · Phone: {COMPANY.phone}</p>
              <p className="text-[0.65rem] text-slate-500 font-medium">GSTIN: {COMPANY.gst}</p>
            </div>

            {/* Date */}
            <div className="text-right text-xs font-medium text-slate-500 mb-6">
              Date: {formatDate(selectedRecord.lastDate)}
            </div>

            {/* Title */}
            <div className="text-center text-lg font-bold text-slate-900 uppercase tracking-widest mb-6 underline underline-offset-4">
              TO WHOMSOEVER IT MAY CONCERN
            </div>

            {/* Content */}
            <div className="text-sm leading-relaxed text-slate-700 mb-8 space-y-3 font-medium">
              <p>
                This is to certify that <strong>{selectedRecord.workerName}</strong> (Worker ID: <strong>{selectedRecord.workerId}</strong>) has been employed with <strong>{COMPANY.name}</strong> as a <strong>{selectedRecord.skill}</strong> in the {selectedRecord.department} Department for our Tata Motors Ltd. contracts.
              </p>
              <p>
                He/She worked with us from <strong>{formatDate(selectedRecord.joiningDate)}</strong> to <strong>{formatDate(selectedRecord.lastDate)}</strong>.
              </p>
              <p>
                During his/her tenure with Sonali Enterprises, we found him/her to be hardworking, punctual, and dedicated to work activities. His/Her conduct and character were satisfactory.
              </p>
              <p>
                We wish him/her all the best for all future endeavors.
              </p>
            </div>

            {/* Signature */}
            <div className="flex justify-between items-end pt-8 border-t border-slate-200">
              <div className="text-xs text-slate-500 font-medium">
                <div>Place: Pune, Maharashtra</div>
                <div>Status: Exit Formalities Complete</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900 text-sm">For Sonali Enterprises</div>
                <div className="text-xs text-slate-500 font-medium mt-6">Authorized Signatory / Management</div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6">
              <button className="btn-outline px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer" onClick={() => setShowExpLetter(false)}>
                Close Preview
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

