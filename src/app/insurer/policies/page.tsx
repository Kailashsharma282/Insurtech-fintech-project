'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  Layers, 
  Building, 
  Sparkles, 
  ArrowRight, 
  Search, 
  Filter,
  RefreshCw,
  FileCheck2,
  FileX2,
  Check,
  X
} from 'lucide-react';
import { Card3D } from '@/components/ui/Card3D';
import { Policy } from '@/lib/types';
import { SEED_POLICIES } from '@/lib/db/seed-data';

export default function InsurerPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>(SEED_POLICIES);
  const [loading, setLoading] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('PENDING_APPROVAL');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Rejection modal state
  const [rejectModalOpen, setRejectModalOpen] = useState<boolean>(false);
  const [selectedPolicyForAction, setSelectedPolicyForAction] = useState<Policy | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('EXCEEDS_SPATIAL_IU_RISK_CAP');
  const [underwriterNotes, setUnderwriterNotes] = useState<string>('');
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/policies');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setPolicies(data.data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleApprove = async (policy: Policy) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/policies/${policy.id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'APPROVE',
          underwriterNotes: 'Approved by Chief Underwriter. Spatial baseline indices validated.'
        })
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage({ type: 'success', text: `Policy ${policy.policyNumber} Approved & Issued!` });
        await fetchPolicies();
      } else {
        setToastMessage({ type: 'error', text: data.error || 'Failed to approve policy' });
      }
    } catch {
      setToastMessage({ type: 'error', text: 'Network failure during policy approval' });
    } finally {
      setActionLoading(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleRejectSubmit = async () => {
    if (!selectedPolicyForAction) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/policies/${selectedPolicyForAction.id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REJECT',
          rejectionReason,
          underwriterNotes: underwriterNotes || 'Application declined based on portfolio concentration risk.'
        })
      });
      const data = await res.json();
      if (data.success) {
        setToastMessage({ type: 'success', text: `Policy ${selectedPolicyForAction.policyNumber} Rejected.` });
        setRejectModalOpen(false);
        setSelectedPolicyForAction(null);
        setUnderwriterNotes('');
        await fetchPolicies();
      } else {
        setToastMessage({ type: 'error', text: data.error || 'Failed to reject policy' });
      }
    } catch {
      setToastMessage({ type: 'error', text: 'Network error during rejection' });
    } finally {
      setActionLoading(false);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const filtered = policies.filter(p => {
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    const matchesSearch = 
      p.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.farmPlot.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const pendingCount = policies.filter(p => p.status === 'PENDING_APPROVAL').length;
  const activeCount = policies.filter(p => p.status === 'ACTIVE').length;
  const rejectedCount = policies.filter(p => p.status === 'REJECTED').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-10 pb-28 md:pb-16 text-[#0F172A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
        
        {/* Toast Notification */}
        {toastMessage && (
          <div className={`fixed top-20 right-4 z-50 p-4 rounded-2xl shadow-2xl text-xs font-bold flex items-center space-x-2 animate-in slide-in-from-top-3 ${
            toastMessage.type === 'success' 
              ? 'bg-[#071511] text-[#34D399] border border-[#10B981]' 
              : 'bg-red-950 text-red-200 border border-red-500'
          }`}>
            {toastMessage.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{toastMessage.text}</span>
          </div>
        )}

        {/* Header with 3D Card */}
        <Card3D depth={4} glowOnHover={false} className="bg-white p-5 sm:p-7 rounded-3xl border border-[#E2E8F0] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#059669] text-xs font-bold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Underwriting Review Desk</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
                Policy Applications & Issuance
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Review pending farmer applications, verify satellite NDVI baselines, and execute Accept or Reject underwriting decisions.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={fetchPolicies}
                disabled={loading}
                className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                title="Refresh List"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <Link
                href="/insurer/dashboard"
                className="px-4 py-2.5 rounded-2xl bg-[#071511] hover:bg-slate-800 text-[#34D399] font-bold text-xs shadow-sm transition-all"
              >
                Portfolio Dashboard &rarr;
              </Link>
            </div>
          </div>
        </Card3D>

        {/* Underwriting KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div 
            onClick={() => setStatusFilter('PENDING_APPROVAL')}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
              statusFilter === 'PENDING_APPROVAL' 
                ? 'bg-amber-50 border-amber-400 shadow-md' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-amber-800 font-bold">
              <span>Pending Review</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-3xl font-black text-amber-900 mt-2">{pendingCount}</div>
            <span className="text-[10px] text-amber-700 font-medium">Awaiting Underwriter Action</span>
          </div>

          <div 
            onClick={() => setStatusFilter('ACTIVE')}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
              statusFilter === 'ACTIVE' 
                ? 'bg-emerald-50 border-emerald-400 shadow-md' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-emerald-800 font-bold">
              <span>Active Policies</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-900 mt-2">{activeCount}</div>
            <span className="text-[10px] text-emerald-700 font-medium">Index Monitoring Running</span>
          </div>

          <div 
            onClick={() => setStatusFilter('REJECTED')}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
              statusFilter === 'REJECTED' 
                ? 'bg-red-50 border-red-400 shadow-md' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-red-800 font-bold">
              <span>Rejected</span>
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-3xl font-black text-red-900 mt-2">{rejectedCount}</div>
            <span className="text-[10px] text-red-700 font-medium">Declined / Over Limit</span>
          </div>

          <div 
            onClick={() => setStatusFilter('ALL')}
            className={`p-5 rounded-3xl border-2 transition-all cursor-pointer ${
              statusFilter === 'ALL' 
                ? 'bg-slate-100 border-slate-400 shadow-md' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-700 font-bold">
              <span>Total Applications</span>
              <Layers className="w-4 h-4 text-slate-600" />
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">{policies.length}</div>
            <span className="text-[10px] text-slate-500 font-medium">All Clusters</span>
          </div>
        </div>

        {/* Filter Bar & Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search farmer, plot, crop, policy #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto text-xs">
            <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">Status:</span>
            {['PENDING_APPROVAL', 'ACTIVE', 'REJECTED', 'ALL'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  statusFilter === st 
                    ? 'bg-[#0F172A] text-white shadow-sm' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {st === 'PENDING_APPROVAL' ? '🟡 Pending Review' : (st === 'ACTIVE' ? '🟢 Active' : (st === 'REJECTED' ? '🔴 Rejected' : 'All'))}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-bold text-slate-700">No applications match your filter</h3>
              <p className="text-xs text-slate-500">Try changing your search term or select another status tab.</p>
            </div>
          ) : (
            filtered.map((policy) => {
              const isPending = policy.status === 'PENDING_APPROVAL';
              const isActive = policy.status === 'ACTIVE';
              const isRejected = policy.status === 'REJECTED';

              return (
                <div
                  key={policy.id}
                  className={`p-5 sm:p-6 rounded-3xl bg-white border transition-all shadow-sm space-y-4 ${
                    isPending ? 'border-amber-300 bg-amber-50/20' : (isRejected ? 'border-red-200 bg-red-50/10' : 'border-slate-200')
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left Details */}
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-black text-slate-900">
                          {policy.policyNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-slate-100 text-slate-700">
                          IU: {policy.insuranceUnitCode}
                        </span>
                        {isPending && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                            🟡 AWAITING DECISION
                          </span>
                        )}
                        {isActive && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono bg-emerald-100 text-emerald-800 border border-emerald-300">
                            🟢 ACTIVE & BOUND
                          </span>
                        )}
                        {isRejected && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black font-mono bg-red-100 text-red-800 border border-red-300">
                            🔴 REJECTED
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                        <span>Farmer: <strong className="text-slate-900">{policy.farmerName}</strong></span>
                        <span>Plot: <strong className="text-slate-900">{policy.farmPlot}</strong></span>
                        <span>Crop: <strong className="text-emerald-700">{policy.crop}</strong></span>
                        <span>Period: <span className="font-mono text-slate-500">{policy.startDate} &rarr; {policy.endDate}</span></span>
                      </div>
                    </div>

                    {/* Financial Summary & Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-5 shrink-0">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono text-right sm:text-left">
                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Sum Insured</span>
                          <strong className="text-slate-900">₹{policy.sumInsured.toLocaleString()}</strong>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Farmer Share</span>
                          <strong className="text-emerald-700">₹{policy.farmerShare.toLocaleString()}</strong>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 col-span-2 sm:col-span-1">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Trigger CHF</span>
                          <strong className="text-amber-700">&le; {policy.triggerChf}</strong>
                        </div>
                      </div>

                      {/* Underwriter Accept / Reject Buttons */}
                      {isPending ? (
                        <div className="flex items-center space-x-2 pt-2 sm:pt-0">
                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => handleApprove(policy)}
                            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-emerald-600 text-white font-black text-xs shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center space-x-1.5 transform active:scale-95"
                          >
                            <Check className="w-4 h-4" />
                            <span>Accept & Issue 🟢</span>
                          </button>

                          <button
                            type="button"
                            disabled={actionLoading}
                            onClick={() => {
                              setSelectedPolicyForAction(policy);
                              setRejectModalOpen(true);
                            }}
                            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white hover:bg-red-50 text-red-600 border border-red-300 font-bold text-xs transition-all flex items-center justify-center space-x-1.5 transform active:scale-95"
                          >
                            <X className="w-4 h-4" />
                            <span>Reject 🔴</span>
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 font-medium">
                          {policy.reviewedAt && (
                            <span>Reviewed on: {new Date(policy.reviewedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      )}

                    </div>

                  </div>

                  {/* Underwriter Notes / Audit Info */}
                  {(policy.underwriterNotes || policy.rejectionReason) && (
                    <div className={`p-3.5 rounded-2xl text-xs space-y-1 ${
                      isRejected ? 'bg-red-50 text-red-900 border border-red-200' : 'bg-slate-50 text-slate-700 border border-slate-200'
                    }`}>
                      {policy.rejectionReason && (
                        <div className="font-bold flex items-center gap-1.5 text-red-800">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Rejection Reason: {policy.rejectionReason}</span>
                        </div>
                      )}
                      {policy.underwriterNotes && (
                        <div className="text-slate-600">
                          <strong>Note:</strong> {policy.underwriterNotes}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Reject Modal */}
      {rejectModalOpen && selectedPolicyForAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Reject Application</h3>
                  <p className="text-[11px] text-slate-500">{selectedPolicyForAction.policyNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Primary Rejection Reason:
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium focus:ring-1 focus:ring-red-500 focus:outline-none"
                >
                  <option value="EXCEEDS_SPATIAL_IU_RISK_CAP">Exceeds Spatial IU Cluster Risk Cap</option>
                  <option value="INSUFFICIENT_HISTORICAL_SATELLITE_BASELINE">Insufficient Historical Satellite Baseline (Cloud Obstruction)</option>
                  <option value="HIGH_FLOOD_PRONE_ZONE_CONCENTRATION">High Flood-Prone Lowland Concentration Limit</option>
                  <option value="LAND_RECORD_MISMATCH">Land Record / GIS Geofence Boundary Discrepancy</option>
                  <option value="PRIOR_SEASON_UNRESOLVED_DISPUTE">Prior Season Unresolved Agronomic Dispute</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Underwriter Comments (Visible in Farmer Portal):
                </label>
                <textarea
                  rows={3}
                  value={underwriterNotes}
                  onChange={(e) => setUnderwriterNotes(e.target.value)}
                  placeholder="Explain why this plot application is being declined..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium focus:ring-1 focus:ring-red-500 focus:outline-none resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleRejectSubmit}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black transition-colors text-xs shadow-md shadow-red-950/20"
              >
                {actionLoading ? 'Processing...' : 'Confirm Rejection 🔴'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
