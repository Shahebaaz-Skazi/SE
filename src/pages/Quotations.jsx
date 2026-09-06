import React, { useState } from 'react';
import { Modal, Input, SectionHeader, formatCurrency, formatDate } from '../components/UI/index.jsx';
import { QUOTATIONS as INITIAL_QUOTATIONS, COMPANY } from '../data/dummyData.js';

const STATUS_COLORS = {
  Draft: 'badge-gray',
  Sent: 'badge-blue',
  Approved: 'badge-green',
  Rejected: 'badge-red',
};

function QuotationCard({ q, onView, onStatusChange }) {
  const total = q.workers * q.duration * q.ratePerWorkerPerDay;
  return (
    <div className="glass-card rounded-xl p-5 fade-in border-l-4 border-l-slate-900 bg-white">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs font-bold text-slate-900">{q.id}</span>
            <span className={`badge ${STATUS_COLORS[q.status]}`}>{q.status}</span>
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">{formatDate(q.date)} · To: {q.client}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-bold text-slate-900 font-mono">
            {formatCurrency(total)}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">excl. GST</div>
        </div>
      </div>
      <p className="text-xs text-slate-700 leading-relaxed mb-3 font-medium">{q.description}</p>
      <div className="flex flex-wrap gap-3 text-xs text-slate-600 mb-4 font-medium">
        <span className="flex items-center gap-1">👷 <strong className="text-slate-900">{q.workers}</strong> workers</span>
        <span className="flex items-center gap-1">📅 <strong className="text-slate-900">{q.duration}</strong> days</span>
        <span className="flex items-center gap-1">💰 <strong className="text-slate-900 font-mono">{formatCurrency(q.ratePerWorkerPerDay)}</strong>/worker/day</span>
      </div>
      {q.notes && (
        <div className="rounded-lg px-3 py-2 mb-3 text-xs text-slate-600 bg-slate-50 border border-slate-200">
          📝 {q.notes}
        </div>
      )}
      <div className="flex gap-2 flex-wrap">
        <button className="btn-outline rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer" onClick={() => onView(q)}>
          View Details
        </button>
        {q.status === 'Draft' && (
          <button className="btn-gold rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer" onClick={() => onStatusChange(q.id, 'Sent')}>
            Mark as Sent
          </button>
        )}
        {q.status === 'Sent' && (
          <>
            <button className="rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-all"
                    onClick={() => onStatusChange(q.id, 'Approved')}>
              Mark Approved
            </button>
            <button className="rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-all"
                    onClick={() => onStatusChange(q.id, 'Rejected')}>
              Rejected
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function Quotations() {
  const [quotations, setQuotations] = useState(INITIAL_QUOTATIONS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewQuotation, setViewQuotation] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');
  const [formData, setFormData] = useState({
    description: '', workers: '', duration: '', rate: '', notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  const filtered = filterStatus === 'All' ? quotations : quotations.filter(q => q.status === filterStatus);

  const calcTotal = () => {
    const w = Number(formData.workers);
    const d = Number(formData.duration);
    const r = Number(formData.rate);
    return w > 0 && d > 0 && r > 0 ? w * d * r : 0;
  };

  const validate = () => {
    const errors = {};
    if (!formData.description.trim()) errors.description = 'Work description is required';
    if (!formData.workers || Number(formData.workers) <= 0) errors.workers = 'Enter number of workers';
    if (!formData.duration || Number(formData.duration) <= 0) errors.duration = 'Enter duration in days';
    if (!formData.rate || Number(formData.rate) <= 0) errors.rate = 'Enter rate per worker per day';
    return errors;
  };

  const handleCreate = () => {
    const errors = validate();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    const newQ = {
      id: `QT-2025-${String(quotations.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      client: COMPANY.client,
      description: formData.description,
      workers: Number(formData.workers),
      duration: Number(formData.duration),
      ratePerWorkerPerDay: Number(formData.rate),
      total: calcTotal(),
      status: 'Draft',
      notes: formData.notes,
    };
    setQuotations([newQ, ...quotations]);
    setShowCreateModal(false);
    setFormData({ description: '', workers: '', duration: '', rate: '', notes: '' });
    setFormErrors({});
  };

  const handleStatusChange = (id, status) => {
    setQuotations(qs => qs.map(q => q.id === id ? { ...q, status } : q));
  };

  const handleFormChange = (field, value) => {
    setFormData(f => ({ ...f, [field]: value }));
    if (formErrors[field]) setFormErrors(e => ({ ...e, [field]: '' }));
  };

  const counts = { All: quotations.length };
  ['Draft', 'Sent', 'Approved', 'Rejected'].forEach(s => {
    counts[s] = quotations.filter(q => q.status === s).length;
  });

  return (
    <div className="pb-20 md:pb-0">
      <SectionHeader
        title="Quotation Management"
        subtitle={`${quotations.length} quotations · Client: Tata Motors Ltd.`}
        action={
          <button className="btn-gold rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowCreateModal(true)}>
            <span>+</span> New Quotation
          </button>
        }
      />

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap mb-5 fade-in-1">
        {['All', 'Draft', 'Sent', 'Approved', 'Rejected'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === s ? 'bg-slate-900 text-white' : 'btn-outline'
            }`}
          >
            {s} <span className="text-[10px] opacity-80">({counts[s] || 0})</span>
          </button>
        ))}
      </div>

      {/* Quotation list */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="glass-card rounded-xl p-10 text-center text-slate-400 font-medium">
            No quotations found
          </div>
        ) : filtered.map((q) => (
          <QuotationCard
            key={q.id}
            q={q}
            onView={setViewQuotation}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {/* View Quotation Modal */}
      <Modal isOpen={!!viewQuotation} onClose={() => setViewQuotation(null)} title="Quotation Details" width="max-w-2xl">
        {viewQuotation && (
          <div>
            {/* Header */}
            <div className="flex justify-between items-start mb-6 pb-5 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  {COMPANY.name}
                </h2>
                <p className="text-xs text-slate-500 mt-1 font-medium">{COMPANY.address}</p>
                <p className="text-xs text-slate-500 font-medium">GST: {COMPANY.gst}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">Quotation</div>
                <div className="font-mono text-xs font-bold text-slate-900 mt-1">{viewQuotation.id}</div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">{formatDate(viewQuotation.date)}</div>
              </div>
            </div>

            {/* To */}
            <div className="mb-5">
              <div className="text-xs text-slate-400 uppercase tracking-widest mb-1 font-bold">To</div>
              <div className="font-bold text-slate-900">{viewQuotation.client}</div>
              <div className="text-xs text-slate-500 font-medium">{COMPANY.clientAddress}</div>
            </div>

            {/* Description */}
            <div className="rounded-lg p-4 mb-5 bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">Work Description</div>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">{viewQuotation.description}</p>
            </div>

            {/* Line items */}
            <div className="overflow-x-auto mb-5">
              <table className="data-table w-full">
                <thead>
                  <tr>
                    <th className="text-left">Workers</th>
                    <th className="text-right">Duration</th>
                    <th className="text-right">Rate/Worker/Day</th>
                    <th className="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-medium">{viewQuotation.workers} skilled workers</td>
                    <td className="text-right font-medium">{viewQuotation.duration} days</td>
                    <td className="text-right font-mono font-medium">{formatCurrency(viewQuotation.ratePerWorkerPerDay)}</td>
                    <td className="text-right font-mono font-bold text-slate-900">{formatCurrency(viewQuotation.workers * viewQuotation.duration * viewQuotation.ratePerWorkerPerDay)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div>
                <div className="text-xs text-slate-400 mb-1 font-medium">Status</div>
                <span className={`badge ${STATUS_COLORS[viewQuotation.status]}`}>{viewQuotation.status}</span>
                {viewQuotation.notes && (
                  <p className="text-xs text-slate-500 mt-2 max-w-xs font-medium">📝 {viewQuotation.notes}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400 mb-1 font-medium">Total Amount</div>
                <div className="text-xl font-bold font-mono text-slate-900">
                  {formatCurrency(viewQuotation.workers * viewQuotation.duration * viewQuotation.ratePerWorkerPerDay)}
                </div>
                <div className="text-xs text-slate-400 font-medium">excl. GST</div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Quotation Modal */}
      <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); setFormErrors({}); }} title="Create New Quotation" width="max-w-lg">
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-xs text-slate-500 font-medium tracking-wide mb-1">Client</div>
            <div className="form-input rounded-lg px-3.5 py-2.5 text-xs text-slate-500 bg-slate-100 cursor-not-allowed">
              {COMPANY.client} (Auto-filled)
            </div>
          </div>
          <Input
            label="Work Description *"
            placeholder="e.g., Supply of skilled welders for chassis assembly line"
            value={formData.description}
            onChange={e => handleFormChange('description', e.target.value)}
            error={formErrors.description}
          />
          <div className="grid grid-cols-3 gap-3">
            <Input
              label="No. of Workers *"
              type="number"
              placeholder="e.g., 8"
              value={formData.workers}
              onChange={e => handleFormChange('workers', e.target.value)}
              error={formErrors.workers}
              min="1"
            />
            <Input
              label="Duration (days) *"
              type="number"
              placeholder="e.g., 30"
              value={formData.duration}
              onChange={e => handleFormChange('duration', e.target.value)}
              error={formErrors.duration}
              min="1"
            />
            <Input
              label="Rate/Worker/Day *"
              type="number"
              placeholder="e.g., 750"
              value={formData.rate}
              onChange={e => handleFormChange('rate', e.target.value)}
              error={formErrors.rate}
              min="1"
            />
          </div>
          <Input
            label="Notes (Optional)"
            placeholder="Any additional notes or conditions..."
            value={formData.notes}
            onChange={e => handleFormChange('notes', e.target.value)}
          />
          {/* Auto-calculated total */}
          {calcTotal() > 0 && (
            <div className="rounded-xl p-4 bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 mb-1 font-semibold">Calculated Total</div>
              <div className="text-xl font-bold font-mono text-slate-900">
                {formatCurrency(calcTotal())}
              </div>
              <div className="text-xs text-slate-500 mt-1 font-medium">
                {formData.workers} workers × {formData.duration} days × {formatCurrency(Number(formData.rate))}
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button className="btn-gold rounded-lg px-5 py-2.5 text-xs font-bold flex-1 cursor-pointer" onClick={handleCreate}>
              Create Quotation
            </button>
            <button className="btn-outline rounded-lg px-5 py-2.5 text-xs font-bold cursor-pointer" onClick={() => { setShowCreateModal(false); setFormErrors({}); }}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
