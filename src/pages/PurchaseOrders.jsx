import React, { useState } from 'react';
import { SectionHeader, formatCurrency, formatDate } from '../components/UI/index.jsx';
import { PURCHASE_ORDERS as INITIAL_POS, WORKERS } from '../data/dummyData.js';

const STATUS_MAP = {
  Open: 'badge-blue',
  'In Progress': 'badge-yellow',
  Completed: 'badge-green',
};

function POCard({ po, onView }) {
  return (
    <div className="glass-card rounded-xl p-5 fade-in border-t-2 border-t-slate-900 bg-white">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-mono text-xs font-bold text-slate-900">{po.id}</span>
            <span className={`badge ${STATUS_MAP[po.status]}`}>{po.status}</span>
          </div>
          <div className="text-xs text-slate-500 font-medium">{formatDate(po.date)} · {po.contactPerson}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-bold font-mono text-slate-900">
            {formatCurrency(po.value)}
          </div>
          <div className="text-[10px] text-slate-400 font-medium">PO Value</div>
        </div>
      </div>

      <p className="text-xs text-slate-800 font-semibold mb-3">{po.workType}</p>

      <div className="flex flex-wrap gap-4 text-xs text-slate-600 mb-4 font-medium">
        <span>👷 <strong className="text-slate-900">{po.workersRequired}</strong> workers required</span>
        <span>📅 <strong className="text-slate-900">{po.duration}</strong> days</span>
        <span>🗓 {formatDate(po.startDate)} → {formatDate(po.endDate)}</span>
      </div>

      {po.status !== 'Open' && (
        <div className="mb-4">
          <div className="text-xs text-slate-500 mb-1.5 font-semibold">Timeline Progress</div>
          <div className="progress-bar bg-slate-100">
            <div
              className="progress-fill bg-slate-900"
              style={{ width: po.status === 'Completed' ? '100%' : '60%' }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-medium">
            <span>{formatDate(po.startDate)}</span>
            <span>{po.status === 'Completed' ? '100%' : '~60%'}</span>
            <span>{formatDate(po.endDate)}</span>
          </div>
        </div>
      )}

      <button
        className="btn-outline rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer"
        onClick={() => onView(po)}
      >
        View Details →
      </button>
    </div>
  );
}

export default function PurchaseOrders() {
  const [pos, setPos] = useState(INITIAL_POS);
  const [selectedPO, setSelectedPO] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = filterStatus === 'All' ? pos : pos.filter(p => p.status === filterStatus);

  const openCount = pos.filter(p => p.status === 'Open').length;
  const inProgressCount = pos.filter(p => p.status === 'In Progress').length;
  const completedCount = pos.filter(p => p.status === 'Completed').length;

  const changeStatus = (id, newStatus) => {
    setPos(ps => ps.map(p => p.id === id ? { ...p, status: newStatus } : p));
    if (selectedPO && selectedPO.id === id) {
      setSelectedPO(sp => ({ ...sp, status: newStatus }));
    }
  };

  const getDeployedWorkers = (po) => {
    if (!po.workers || po.workers.length === 0) return [];
    return po.workers.map(wId => WORKERS.find(w => w.id === wId)).filter(Boolean);
  };

  const totalValue = pos.reduce((s, p) => s + p.value, 0);
  const avgWage = 750;

  return (
    <div className="pb-20 md:pb-0">
      <SectionHeader
        title="Purchase Orders"
        subtitle={`${pos.length} POs from Tata Motors · Total Value: ${formatCurrency(totalValue)}`}
      />

      {/* Status Summary */}
      <div className="flex gap-3 mb-5 flex-wrap fade-in-1">
        <div className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold bg-sky-50 border border-sky-200 text-sky-700">
          <span className="w-2 h-2 rounded-full bg-sky-500" /> Open: {openCount}
        </div>
        <div className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold bg-amber-50 border border-amber-200 text-amber-700">
          <span className="w-2 h-2 rounded-full bg-amber-500" /> In Progress: {inProgressCount}
        </div>
        <div className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold bg-emerald-50 border border-emerald-200 text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed: {completedCount}
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap mb-5 fade-in-2">
        {['All', 'Open', 'In Progress', 'Completed'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filterStatus === s ? 'bg-slate-900 text-white' : 'btn-outline'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* PO Detail Panel */}
      {selectedPO && (
        <div className="glass-card rounded-xl p-5 mb-5 fade-in border-l-4 border-l-slate-900 bg-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-900 text-base font-mono">
                  {selectedPO.id}
                </h3>
                <span className={`badge ${STATUS_MAP[selectedPO.status]}`}>{selectedPO.status}</span>
              </div>
              <p className="text-xs text-slate-800 font-semibold">{selectedPO.workType}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{selectedPO.contactPerson}</p>
            </div>
            <button onClick={() => setSelectedPO(null)} className="text-slate-400 hover:text-slate-900 text-xl w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer flex-shrink-0">×</button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
            <div className="glass-card rounded-lg p-3 bg-slate-50 border-slate-200">
              <div className="text-[11px] text-slate-500 mb-1 font-semibold">PO Value</div>
              <div className="text-base font-bold font-mono text-slate-900">{formatCurrency(selectedPO.value)}</div>
            </div>
            <div className="glass-card rounded-lg p-3 bg-slate-50 border-slate-200">
              <div className="text-[11px] text-slate-500 mb-1 font-semibold">Workers</div>
              <div className="text-base font-bold font-mono text-slate-900">{selectedPO.workersRequired}</div>
            </div>
            <div className="glass-card rounded-lg p-3 bg-slate-50 border-slate-200">
              <div className="text-[11px] text-slate-500 mb-1 font-semibold">Duration</div>
              <div className="text-base font-bold font-mono text-slate-900">{selectedPO.duration} days</div>
            </div>
            <div className="glass-card rounded-lg p-3 bg-slate-50 border-slate-200">
              <div className="text-[11px] text-slate-500 mb-1 font-semibold">Est. Profit</div>
              <div className="text-base font-bold font-mono text-emerald-700">
                {formatCurrency(selectedPO.value - (selectedPO.workersRequired * selectedPO.duration * avgWage))}
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mb-5">
            <div className="text-xs text-slate-500 mb-2 uppercase tracking-widest font-bold">Timeline</div>
            <div className="progress-bar bg-slate-100">
              <div className="progress-fill bg-slate-900" style={{ width: selectedPO.status === 'Completed' ? '100%' : selectedPO.status === 'In Progress' ? '60%' : '5%' }} />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1 font-medium">
              <span>Start: {formatDate(selectedPO.startDate)}</span>
              <span>End: {formatDate(selectedPO.endDate)}</span>
            </div>
          </div>

          {/* Workers deployed */}
          {getDeployedWorkers(selectedPO).length > 0 && (
            <div className="mb-5">
              <div className="text-xs text-slate-500 mb-2 uppercase tracking-widest font-bold">Workers Deployed</div>
              <div className="flex flex-wrap gap-2">
                {getDeployedWorkers(selectedPO).map(w => (
                  <div key={w.id} className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs bg-slate-100 border border-slate-200">
                    <span className="font-semibold text-slate-900">{w.name.split(' ')[0]}</span>
                    <span className="text-slate-500 font-medium">{w.skill}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status change */}
          <div className="flex gap-2 flex-wrap">
            <div className="text-xs text-slate-500 self-center font-medium">Change Status:</div>
            {selectedPO.status === 'Open' && (
              <button className="btn-gold rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer"
                      onClick={() => changeStatus(selectedPO.id, 'In Progress')}>
                → Start (In Progress)
              </button>
            )}
            {selectedPO.status === 'In Progress' && (
              <button className="rounded-lg px-3 py-1.5 text-xs font-bold cursor-pointer bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 transition-all"
                      onClick={() => changeStatus(selectedPO.id, 'Completed')}>
                ✓ Mark Completed
              </button>
            )}
            {selectedPO.status === 'Completed' && (
              <span className="text-xs text-emerald-700 font-bold">✓ This PO is completed</span>
            )}
          </div>
        </div>
      )}

      {/* PO Cards */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="glass-card rounded-xl p-10 text-center text-slate-400 font-medium">No purchase orders found</div>
        ) : filtered.map(po => (
          <POCard key={po.id} po={po} onView={setSelectedPO} />
        ))}
      </div>
    </div>
  );
}
