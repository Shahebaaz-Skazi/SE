import React, { useState } from 'react';
import { Modal, Input, Select, SectionHeader, formatCurrency, formatDate } from '../components/UI/index.jsx';
import { WORKERS as INITIAL_WORKERS } from '../data/dummyData.js';

const SKILLS = ['Welding', 'Fitter', 'Electrician', 'Helper', 'Painter', 'CNC Operator', 'Turner', 'Forklift Operator', 'Quality Inspector', 'Machinist', 'Plumber', 'Carpenter'];
const DEPARTMENTS = ['Assembly', 'Fabrication', 'Electrical', 'General', 'Finishing', 'Machining', 'Logistics', 'Quality', 'Maintenance'];

function WorkerAvatar({ name }) {
  const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('');
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-slate-100 text-slate-800 border border-slate-300">
      {initials}
    </div>
  );
}

export default function Workers() {
  const [workers, setWorkers] = useState(INITIAL_WORKERS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    name: '', phone: '', skill: 'Welding', dailyWage: '', joiningDate: '', department: 'Assembly',
  });
  const [formErrors, setFormErrors] = useState({});

  const filtered = workers.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.skill.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === 'All' || w.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Worker name is required';
    if (!/^\d{10}$/.test(formData.phone)) errors.phone = 'Phone must be 10 digits';
    if (!formData.skill) errors.skill = 'Please select a skill';
    if (!formData.dailyWage || Number(formData.dailyWage) <= 0) errors.dailyWage = 'Daily wage must be greater than 0';
    if (!formData.joiningDate) errors.joiningDate = 'Joining date is required';
    return errors;
  };

  const handleAddWorker = () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    const newId = `SE-${String(workers.length + 1).padStart(3, '0')}`;
    const newWorker = {
      id: newId,
      name: formData.name.trim(),
      phone: formData.phone,
      skill: formData.skill,
      dailyWage: Number(formData.dailyWage),
      status: 'Active',
      joiningDate: formData.joiningDate,
      daysWorked: 0,
      department: formData.department,
    };
    setWorkers([...workers, newWorker]);
    setShowAddModal(false);
    setFormData({ name: '', phone: '', skill: 'Welding', dailyWage: '', joiningDate: '', department: 'Assembly' });
    setFormErrors({});
  };

  const handleFormChange = (field, value) => {
    setFormData(f => ({ ...f, [field]: value }));
    if (formErrors[field]) setFormErrors(e => ({ ...e, [field]: '' }));
  };

  const toggleStatus = (id) => {
    setWorkers(ws => ws.map(w => w.id === id ? { ...w, status: w.status === 'Active' ? 'Inactive' : 'Active' } : w));
  };

  const activeCount = workers.filter(w => w.status === 'Active').length;
  const inactiveCount = workers.filter(w => w.status === 'Inactive').length;

  return (
    <div className="pb-20 md:pb-0">
      <SectionHeader
        title="Worker Management"
        subtitle={`${workers.length} workers registered · ${activeCount} active, ${inactiveCount} inactive`}
        action={
          <button className="btn-gold rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-2"
                  onClick={() => setShowAddModal(true)}>
            <span>+</span> Add Worker
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5 fade-in-1">
        <div className="flex-1">
          <input
            className="form-input rounded-xl px-4 py-2.5 text-xs w-full bg-white border border-slate-300 text-slate-900"
            placeholder="🔍 Search by name, skill, or ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Active', 'Inactive'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterStatus === s
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'btn-outline'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Worker Detail Panel */}
      {selectedWorker && (
        <div className="glass-card rounded-xl p-5 mb-5 fade-in border-l-4 border-l-slate-900 bg-white">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <WorkerAvatar name={selectedWorker.name} />
              <div>
                <div className="font-bold text-slate-900 text-sm">{selectedWorker.name}</div>
                <div className="text-xs text-slate-500 font-medium">{selectedWorker.id} · {selectedWorker.skill} · {selectedWorker.department}</div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">📞 {selectedWorker.phone} · Joined {formatDate(selectedWorker.joiningDate)}</div>
              </div>
            </div>
            <button onClick={() => setSelectedWorker(null)} className="text-slate-400 hover:text-slate-900 text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer">×</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card rounded-lg p-3 bg-slate-50 border-slate-200">
              <div className="text-[11px] text-slate-500 mb-1 font-semibold">Days Worked</div>
              <div className="text-base font-bold text-slate-900 font-mono">{selectedWorker.daysWorked} / 26</div>
              <div className="progress-bar mt-2 bg-slate-200">
                <div className="progress-fill bg-slate-900" style={{ width: `${(selectedWorker.daysWorked / 26) * 100}%` }} />
              </div>
            </div>
            <div className="glass-card rounded-lg p-3 bg-slate-50 border-slate-200">
              <div className="text-[11px] text-slate-500 mb-1 font-semibold">Gross Pay</div>
              <div className="text-base font-bold text-slate-900 font-mono">{formatCurrency(selectedWorker.daysWorked * selectedWorker.dailyWage)}</div>
              <div className="text-xs text-slate-500 mt-1">@ {formatCurrency(selectedWorker.dailyWage)}/day</div>
            </div>
            <div className="glass-card rounded-lg p-3 bg-slate-50 border-slate-200">
              <div className="text-[11px] text-slate-500 mb-1 font-semibold">Deductions</div>
              <div className="text-base font-bold text-rose-600 font-mono">
                {formatCurrency(Math.round(selectedWorker.daysWorked * selectedWorker.dailyWage * 0.1275))}
              </div>
              <div className="text-xs text-slate-500 mt-1">PF 12% + ESIC 0.75%</div>
            </div>
            <div className="glass-card rounded-lg p-3 bg-slate-50 border-slate-200">
              <div className="text-[11px] text-slate-500 mb-1 font-semibold">Net Take-Home</div>
              <div className="text-base font-bold text-emerald-700 font-mono">
                {formatCurrency(Math.round(selectedWorker.daysWorked * selectedWorker.dailyWage * 0.8725))}
              </div>
              <div className="text-xs text-slate-500 mt-1">After deductions</div>
            </div>
          </div>
        </div>
      )}

      {/* Workers Table */}
      <div className="fade-in-2">
        <div className="glass-card rounded-xl overflow-hidden border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="data-table w-full min-w-[700px]">
              <thead>
                <tr>
                  <th className="text-left">Worker</th>
                  <th className="text-left">Role / Skill</th>
                  <th className="text-right">Daily Wage</th>
                  <th className="text-right">Days Worked</th>
                  <th className="text-right">Month Earnings</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-10 text-slate-400 text-xs font-medium">
                      No workers found
                    </td>
                  </tr>
                ) : filtered.map((worker) => (
                  <tr key={worker.id} className="cursor-pointer" onClick={() => setSelectedWorker(worker)}>
                    <td>
                      <div className="flex items-center gap-3">
                        <WorkerAvatar name={worker.name} />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{worker.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{worker.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-xs text-slate-800 font-semibold">{worker.skill}</div>
                      <div className="text-[11px] text-slate-500">{worker.department}</div>
                    </td>
                    <td className="text-right text-xs font-bold text-slate-900 font-mono">
                      {formatCurrency(worker.dailyWage)}
                    </td>
                    <td className="text-right">
                      <div className="text-xs text-slate-800 font-medium font-mono">{worker.daysWorked} / 26</div>
                    </td>
                    <td className="text-right font-bold text-slate-900 font-mono">
                      {formatCurrency(worker.daysWorked * worker.dailyWage)}
                    </td>
                    <td className="text-center">
                      <span className={`badge ${worker.status === 'Active' ? 'badge-green' : 'badge-gray'}`}>
                        {worker.status}
                      </span>
                    </td>
                    <td className="text-center" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          className="btn-outline rounded-lg px-2.5 py-1 text-xs font-bold"
                          onClick={() => setSelectedWorker(worker)}
                        >
                          View
                        </button>
                        <button
                          className={`rounded-lg px-2.5 py-1 text-xs font-bold cursor-pointer transition-all ${worker.status === 'Active' ? 'bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100' : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100'}`}
                          onClick={() => toggleStatus(worker.id)}
                        >
                          {worker.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-slate-100 text-xs text-slate-500 font-medium bg-slate-50/50">
            Showing {filtered.length} of {workers.length} workers
          </div>
        </div>
      </div>

      {/* Add Worker Modal */}
      <Modal isOpen={showAddModal} onClose={() => { setShowAddModal(false); setFormErrors({}); }} title="Add New Worker" width="max-w-lg">
        <div className="flex flex-col gap-4">
          <Input
            label="Full Name *"
            placeholder="e.g., Ramesh Kumar Sharma"
            value={formData.name}
            onChange={e => handleFormChange('name', e.target.value)}
            error={formErrors.name}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone Number *"
              placeholder="10-digit mobile"
              value={formData.phone}
              onChange={e => handleFormChange('phone', e.target.value)}
              error={formErrors.phone}
              maxLength={10}
            />
            <Input
              label="Daily Wage (₹) *"
              type="number"
              placeholder="e.g., 750"
              value={formData.dailyWage}
              onChange={e => handleFormChange('dailyWage', e.target.value)}
              error={formErrors.dailyWage}
              min="0"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Skill / Role *"
              value={formData.skill}
              onChange={e => handleFormChange('skill', e.target.value)}
              error={formErrors.skill}
            >
              {SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Select
              label="Department"
              value={formData.department}
              onChange={e => handleFormChange('department', e.target.value)}
            >
              {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
            </Select>
          </div>
          <Input
            label="Joining Date *"
            type="date"
            value={formData.joiningDate}
            onChange={e => handleFormChange('joiningDate', e.target.value)}
            error={formErrors.joiningDate}
          />
          {formData.dailyWage && Number(formData.dailyWage) > 0 && (
            <div className="rounded-lg p-3 bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 mb-1 font-semibold">Estimated Monthly Earnings (26 days)</div>
              <div className="text-base font-bold text-slate-900 font-mono">
                {formatCurrency(Number(formData.dailyWage) * 26)}
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button className="btn-gold rounded-lg px-5 py-2.5 text-xs font-bold flex-1 cursor-pointer" onClick={handleAddWorker}>
              Add Worker
            </button>
            <button className="btn-outline rounded-lg px-5 py-2.5 text-xs font-bold cursor-pointer" onClick={() => { setShowAddModal(false); setFormErrors({}); }}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
