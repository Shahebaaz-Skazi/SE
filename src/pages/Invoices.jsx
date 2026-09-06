import React, { useState } from 'react';
import { Modal, SectionHeader, formatCurrency, formatDate } from '../components/UI/index.jsx';
import { INVOICES as INITIAL_INVOICES, COMPANY, PURCHASE_ORDERS } from '../data/dummyData.js';

const STATUS_MAP = {
  Paid: 'badge-green',
  Pending: 'badge-yellow',
  Overdue: 'badge-red',
};

function InvoiceDetail({ inv, onClose, onMarkPaid }) {
  return (
    <div>
      {/* Company Header */}
      <div className="flex justify-between items-start mb-6 pb-5 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {COMPANY.name}
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">{COMPANY.address}</p>
          <p className="text-xs text-slate-500 font-medium">GST: {COMPANY.gst}</p>
          <p className="text-xs text-slate-500 font-medium">📞 {COMPANY.phone} · ✉ {COMPANY.email}</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-black uppercase tracking-widest text-slate-300">INVOICE</div>
          <div className="font-mono text-xs font-bold text-slate-900 mt-1"># {inv.id}</div>
          <div className="text-xs text-slate-500 font-medium">Date: {formatDate(inv.date)}</div>
          <div className="text-xs text-slate-500 font-medium">Due: {formatDate(inv.dueDate)}</div>
        </div>
      </div>

      {/* Bill To */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-bold">Bill To</div>
          <div className="font-bold text-slate-900">{inv.billTo}</div>
          <div className="text-xs text-slate-500 mt-1 font-medium">{inv.billToAddress}</div>
        </div>
        <div>
          <div className="text-xs text-slate-400 uppercase tracking-widest mb-2 font-bold">Payment Info</div>
          <div className="flex items-center gap-2">
            <span className={`badge ${STATUS_MAP[inv.status]}`}>{inv.status}</span>
          </div>
          {inv.paidDate && (
            <div className="text-xs text-slate-500 mt-1 font-medium">Paid on: {formatDate(inv.paidDate)}</div>
          )}
          {inv.po && (
            <div className="text-xs text-slate-500 mt-1 font-medium">PO Ref: {inv.po}</div>
          )}
        </div>
      </div>

      {/* Line Items */}
      <div className="overflow-x-auto mb-5">
        <table className="data-table w-full">
          <thead>
            <tr>
              <th className="text-left">Description</th>
              <th className="text-right">Workers</th>
              <th className="text-right">Days</th>
              <th className="text-right">Rate/Day</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="max-w-xs">
                <div className="text-xs text-slate-800 font-medium">{inv.description}</div>
              </td>
              <td className="text-right font-medium">{inv.workerCount}</td>
              <td className="text-right font-medium">{inv.daysWorked}</td>
              <td className="text-right font-mono font-medium">{formatCurrency(inv.ratePerDay)}</td>
              <td className="text-right font-mono font-bold text-slate-900">{formatCurrency(inv.subtotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-6">
        <div className="w-64">
          <div className="flex justify-between py-2 text-xs border-b border-slate-200">
            <span className="text-slate-500 font-medium">Subtotal</span>
            <span className="text-slate-900 font-mono font-bold">{formatCurrency(inv.subtotal)}</span>
          </div>
          <div className="flex justify-between py-2 text-xs border-b border-slate-200">
            <span className="text-slate-500 font-medium">GST @ 18%</span>
            <span className="text-slate-900 font-mono font-bold">{formatCurrency(inv.gst)}</span>
          </div>
          <div className="flex justify-between py-3 text-sm font-bold text-slate-900">
            <span>Grand Total</span>
            <span className="font-mono">{formatCurrency(inv.grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        {inv.status !== 'Paid' && (
          <button className="btn-gold rounded-lg px-4 py-2 text-xs font-bold cursor-pointer" onClick={onMarkPaid}>
            ✓ Mark as Paid
          </button>
        )}
        <button className="btn-outline rounded-lg px-4 py-2 text-xs font-bold cursor-pointer" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default function Invoices() {
  const [invoices, setInvoices] = useState(INITIAL_INVOICES);
  const [viewInvoice, setViewInvoice] = useState(null);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [genForm, setGenForm] = useState({ poId: PURCHASE_ORDERS[0].id, rate: 750 });

  const filtered = filterStatus === 'All' ? invoices : invoices.filter(i => i.status === filterStatus);

  const totalInvoiced = invoices.reduce((s, i) => s + i.grandTotal, 0);
  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.grandTotal, 0);
  const totalPending = invoices.filter(i => i.status !== 'Paid').reduce((s, i) => s + i.grandTotal, 0);

  const markPaid = (id) => {
    const today = new Date().toISOString().split('T')[0];
    setInvoices(ivs => ivs.map(i => i.id === id ? { ...i, status: 'Paid', paidDate: today } : i));
    if (viewInvoice && viewInvoice.id === id) {
      setViewInvoice(v => ({ ...v, status: 'Paid', paidDate: today }));
    }
  };

  const handleGenerate = () => {
    const po = PURCHASE_ORDERS.find(p => p.id === genForm.poId);
    if (!po) return;
    const rate = Number(genForm.rate);
    const subtotal = po.workersRequired * po.duration * rate;
    const gst = subtotal * 0.18;
    const newInv = {
      id: `INV-SE-2025-${String(invoices.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      po: po.id,
      billTo: COMPANY.client,
      billToAddress: COMPANY.clientAddress,
      description: `${po.workType} — ${po.workersRequired} workers × ${po.duration} days`,
      workerCount: po.workersRequired,
      daysWorked: po.duration,
      ratePerDay: rate,
      subtotal,
      gst,
      grandTotal: subtotal + gst,
      status: 'Pending',
      paidDate: null,
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    };
    setInvoices([newInv, ...invoices]);
    setShowGenerateModal(false);
  };

  const counts = { All: invoices.length };
  ['Paid', 'Pending', 'Overdue'].forEach(s => { counts[s] = invoices.filter(i => i.status === s).length; });

  return (
    <div className="pb-20 md:pb-0">
      <SectionHeader
        title="Invoice Management"
        subtitle={`${invoices.length} invoices · ${formatCurrency(totalInvoiced)} total billed`}
        action={
          <button className="btn-gold rounded-lg px-4 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer"
                  onClick={() => setShowGenerateModal(true)}>
            <span>+</span> Generate Invoice
          </button>
        }
      />

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3 mb-5 fade-in-1">
        {[
          { label: 'Total Invoiced', value: totalInvoiced, color: '#0f172a' },
          { label: 'Received', value: totalPaid, color: '#047857' },
          { label: 'Outstanding', value: totalPending, color: '#b45309' },
        ].map((s, i) => (
          <div key={i} className="glass-card rounded-xl p-3 text-center bg-white" style={{ borderTop: `2px solid ${s.color}` }}>
            <div className="text-sm font-bold font-mono" style={{ color: s.color }}>{formatCurrency(s.value)}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-semibold uppercase tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap mb-5 fade-in-2">
        {['All', 'Paid', 'Pending', 'Overdue'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              filterStatus === s ? 'bg-slate-900 text-white' : 'btn-outline'
            }`}
          >
            {s} <span className="opacity-70">({counts[s] || 0})</span>
          </button>
        ))}
      </div>

      {/* Invoice Cards */}
      <div className="flex flex-col gap-4">
        {filtered.map(inv => (
          <div key={inv.id} className="glass-card rounded-xl p-5 fade-in border-l-4 border-l-slate-900 bg-white">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-mono text-xs font-bold text-slate-900">{inv.id}</span>
                  <span className={`badge ${STATUS_MAP[inv.status]}`}>{inv.status}</span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {formatDate(inv.date)} · Due: {formatDate(inv.dueDate)}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold font-mono text-slate-900">
                  {formatCurrency(inv.grandTotal)}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">incl. GST 18%</div>
              </div>
            </div>

            <p className="text-xs text-slate-700 mb-3 font-medium">{inv.description}</p>

            <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-4 font-medium">
              <span>🏢 {inv.billTo}</span>
              {inv.po && <span>📋 Ref: {inv.po}</span>}
              <span>📊 Subtotal: <strong className="font-mono">{formatCurrency(inv.subtotal)}</strong> + GST <strong className="font-mono">{formatCurrency(inv.gst)}</strong></span>
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                className="btn-outline rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer"
                onClick={() => setViewInvoice(inv)}
              >
                View Invoice
              </button>
              {inv.status !== 'Paid' && (
                <button
                  className="btn-gold rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer"
                  onClick={() => markPaid(inv.id)}
                >
                  ✓ Mark as Paid
                </button>
              )}
              {inv.paidDate && (
                <span className="text-xs text-emerald-700 self-center font-bold">✓ Paid on {formatDate(inv.paidDate)}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Invoice Detail Modal */}
      <Modal isOpen={!!viewInvoice} onClose={() => setViewInvoice(null)} title="Invoice" width="max-w-2xl">
        {viewInvoice && (
          <InvoiceDetail
            inv={viewInvoice}
            onClose={() => setViewInvoice(null)}
            onMarkPaid={() => markPaid(viewInvoice.id)}
          />
        )}
      </Modal>

      {/* Generate Invoice Modal */}
      <Modal isOpen={showGenerateModal} onClose={() => setShowGenerateModal(false)} title="Generate Invoice" width="max-w-lg">
        <div className="flex flex-col gap-4">
          <div>
            <div className="text-xs text-slate-500 mb-1 font-semibold tracking-wide">Select Purchase Order</div>
            <select
              className="form-input rounded-lg px-3.5 py-2.5 text-xs w-full bg-white border border-slate-300"
              value={genForm.poId}
              onChange={e => setGenForm(f => ({ ...f, poId: e.target.value }))}
            >
              {PURCHASE_ORDERS.map(po => (
                <option key={po.id} value={po.id}>{po.id} — {po.workType.substring(0, 40)}...</option>
              ))}
            </select>
          </div>

          {(() => {
            const po = PURCHASE_ORDERS.find(p => p.id === genForm.poId);
            const rate = Number(genForm.rate);
            const sub = po ? po.workersRequired * po.duration * rate : 0;
            const gst = sub * 0.18;
            return po ? (
              <>
                <div className="rounded-lg p-3 text-xs text-slate-600 bg-slate-50 border border-slate-200">
                  <div className="grid grid-cols-3 gap-2 font-medium">
                    <div><div className="text-slate-400">Workers</div><div className="text-slate-900 font-bold">{po.workersRequired}</div></div>
                    <div><div className="text-slate-400">Duration</div><div className="text-slate-900 font-bold">{po.duration} days</div></div>
                    <div><div className="text-slate-400">Work Type</div><div className="text-slate-900 font-bold truncate">{po.workType.substring(0, 20)}...</div></div>
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1 font-semibold tracking-wide">Rate Per Day Per Worker (₹)</div>
                  <input
                    type="number"
                    className="form-input rounded-lg px-3.5 py-2.5 text-xs w-full bg-white border border-slate-300"
                    value={genForm.rate}
                    onChange={e => setGenForm(f => ({ ...f, rate: e.target.value }))}
                    min="0"
                  />
                </div>
                {rate > 0 && (
                  <div className="rounded-xl p-4 bg-slate-50 border border-slate-200">
                    <div className="flex justify-between text-xs mb-2 font-medium">
                      <span className="text-slate-500">Subtotal</span>
                      <span className="text-slate-900 font-mono font-bold">{formatCurrency(sub)}</span>
                    </div>
                    <div className="flex justify-between text-xs mb-3 font-medium">
                      <span className="text-slate-500">GST 18%</span>
                      <span className="text-slate-900 font-mono font-bold">{formatCurrency(gst)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold border-t border-slate-200 pt-2 text-slate-900">
                      <span>Grand Total</span>
                      <span className="font-mono">{formatCurrency(sub + gst)}</span>
                    </div>
                  </div>
                )}
              </>
            ) : null;
          })()}

          <div className="flex gap-3 pt-2">
            <button className="btn-gold rounded-lg px-5 py-2.5 text-xs font-bold flex-1 cursor-pointer" onClick={handleGenerate}>
              Generate Invoice
            </button>
            <button className="btn-outline rounded-lg px-5 py-2.5 text-xs font-bold cursor-pointer" onClick={() => setShowGenerateModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
