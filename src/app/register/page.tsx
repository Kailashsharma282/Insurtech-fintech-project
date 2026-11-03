'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Satellite, 
  Phone, 
  Mail, 
  Lock, 
  ArrowRight
} from 'lucide-react';
import { useRole } from '@/context/RoleContext';
import { Role } from '@/lib/types';

export default function RegisterPage() {
  const router = useRouter();
  const { registerUser } = useRole();
  const [selectedRole, setSelectedRole] = useState<Role>('FARMER');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Common Form Fields
  const [fullName, setFullName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // Farmer Specific Fields
  const [district, setDistrict] = useState<string>('Ghatal, Paschim Medinipur');
  const [village, setVillage] = useState<string>('Ghatal');
  const [primaryCrop, setPrimaryCrop] = useState<string>('Aman Paddy');
  const [farmSizeHa, setFarmSizeHa] = useState<string>('2.8');
  const [bankAccount, setBankAccount] = useState<string>('');

  // Insurer Specific Fields
  const [organization, setOrganization] = useState<string>('Agriculture Insurance Co. of India');
  const [licenseId, setLicenseId] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await registerUser({
        name: fullName,
        role: selectedRole,
        phone,
        email,
        district,
        village,
        primaryCrop,
        farmSizeHa: parseFloat(farmSizeHa) || 2.0,
        bankAccount,
        organization: selectedRole === 'INSURER' ? organization : undefined,
        licenseId: selectedRole === 'INSURER' ? licenseId : undefined,
      });

      if (res.success) {
        if (selectedRole === 'FARMER') router.push('/farmer/dashboard');
        else if (selectedRole === 'INSURER') router.push('/insurer/dashboard');
        else if (selectedRole === 'ADMIN') router.push('/admin/overview');
        else router.push('/intelligence/map');
      } else {
        setErrorMsg(res.message || 'Registration failed.');
      }
    } catch {
      setErrorMsg('Failed to complete registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-2">
        <Link href="/" className="inline-flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
            <Satellite className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="font-black text-2xl text-slate-900 tracking-tight block">
              AgriSure
            </span>
            <span className="text-[11px] text-slate-500 block">
              Ghatal Block &bull; Account Registration
            </span>
          </div>
        </Link>

        <h2 className="text-2xl font-black text-slate-900 pt-2">
          Create New Entity Account
        </h2>
        <p className="text-xs text-slate-600">
          Onboard farmers, underwriters, and field survey officers.
        </p>
      </div>

      {/* Role Switcher Tabs */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-200 p-1 rounded-xl">
          {(['FARMER', 'INSURER', 'FIELD_AGENT', 'ADMIN'] as Role[]).map((r) => {
            const isSelected = selectedRole === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => { setSelectedRole(r); setErrorMsg(null); }}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-colors flex flex-col items-center justify-center space-y-0.5 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300'
                }`}
              >
                <span className="text-base">
                  {r === 'FARMER' ? '🧑‍🌾' : (r === 'INSURER' ? '🏛️' : (r === 'FIELD_AGENT' ? '🔍' : '⚙️'))}
                </span>
                <span>
                  {r === 'FARMER' ? 'Farmer' : (r === 'INSURER' ? 'Insurer' : (r === 'FIELD_AGENT' ? 'Field Agent' : 'Admin'))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Registration Form Card */}
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-5">
          
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              {selectedRole === 'FARMER' && '🧑‍🌾 Farmer Onboarding & Land Record'}
              {selectedRole === 'INSURER' && '🏛️ Institutional Underwriter Registration'}
              {selectedRole === 'FIELD_AGENT' && '🔍 Field Verification Officer'}
              {selectedRole === 'ADMIN' && '⚙️ Systems Administrator Account'}
            </h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              {selectedRole}
            </span>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={selectedRole === 'FARMER' ? 'Subhash Biswas' : 'Dr. S. Sen'}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {selectedRole === 'FARMER' || selectedRole === 'FIELD_AGENT' ? 'Mobile Phone *' : 'Corporate Email *'}
                </label>
                <input
                  type={selectedRole === 'FARMER' || selectedRole === 'FIELD_AGENT' ? 'tel' : 'email'}
                  required
                  value={selectedRole === 'FARMER' || selectedRole === 'FIELD_AGENT' ? phone : email}
                  onChange={(e) => {
                    if (selectedRole === 'FARMER' || selectedRole === 'FIELD_AGENT') setPhone(e.target.value);
                    else setEmail(e.target.value);
                  }}
                  placeholder={selectedRole === 'FARMER' || selectedRole === 'FIELD_AGENT' ? '+91 98321 00000' : 'underwriter@insurance.com'}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                />
              </div>
            </div>

            {/* Farmer Specific Fields */}
            {selectedRole === 'FARMER' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Block & District *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    >
                      <option value="Ghatal, Paschim Medinipur">Ghatal, Paschim Medinipur (Pilot Block)</option>
                      <option value="Daspur, Paschim Medinipur">Daspur, Paschim Medinipur</option>
                      <option value="Chandrakona, Paschim Medinipur">Chandrakona, Paschim Medinipur</option>
                      <option value="Nadia">Nadia District</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Gram Panchayat / Village *
                    </label>
                    <input
                      type="text"
                      required
                      value={village}
                      onChange={(e) => setVillage(e.target.value)}
                      placeholder="e.g. Ghatal Gram Panchayat"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Primary Crop *
                    </label>
                    <select
                      value={primaryCrop}
                      onChange={(e) => setPrimaryCrop(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    >
                      <option value="Aman Paddy">Aman Paddy (Kharif Monsoon)</option>
                      <option value="Boro Paddy">Boro Paddy (Winter)</option>
                      <option value="Jute">Jute</option>
                      <option value="Potato">Potato</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Total Cultivated Area (Ha) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={farmSizeHa}
                      onChange={(e) => setFarmSizeHa(e.target.value)}
                      placeholder="2.8"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Bank Account / IFSC (for Direct DBT Indemnity)
                  </label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    placeholder="e.g. State Bank of India - SBIN0001234 - A/C 38294819201"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </>
            )}

            {/* Insurer Specific Fields */}
            {selectedRole === 'INSURER' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Insurance Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Agriculture Insurance Co. of India"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    IRDAI License ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={licenseId}
                    onChange={(e) => setLicenseId(e.target.value)}
                    placeholder="IRDAI-AGR-2024-8842"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Account Password *
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Creating...' : `Register ${selectedRole} Account`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-200">
            <span className="text-xs text-slate-500">
              Already have an account?{' '}
            </span>
            <Link href="/login" className="text-xs font-bold text-emerald-700 hover:underline">
              Sign in &rarr;
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
