'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Satellite, 
  ShieldCheck, 
  Cpu, 
  UserCheck, 
  Phone, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Building, 
  MapPin, 
  FileText,
  CreditCard,
  Sprout
} from 'lucide-react';
import { useRole } from '@/context/RoleContext';
import { Role } from '@/lib/types';
import { Card3D } from '@/components/ui/Card3D';
import { CyberBackground } from '@/components/ui/CyberBackground';

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
  const [district, setDistrict] = useState<string>('Nadia');
  const [village, setVillage] = useState<string>('');
  const [primaryCrop, setPrimaryCrop] = useState<string>('Aman Paddy');
  const [farmSizeHa, setFarmSizeHa] = useState<string>('2.5');
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
    <div className="min-h-screen bg-[#071511] text-white flex flex-col justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* 3D Cyber Background */}
      <CyberBackground variant="hero" showParticles={true} showGrid={true} />

      <div className="sm:mx-auto sm:w-full sm:max-w-2xl relative z-10 text-center space-y-3">
        <Link href="/" className="inline-flex items-center space-x-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-lg shadow-[#10B981]/30 group-hover:scale-105 transition-transform">
            <Satellite className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <div className="flex items-center space-x-2">
              <span className="font-black text-2xl tracking-tight bg-gradient-to-r from-white via-emerald-100 to-[#34D399] bg-clip-text text-transparent">
                AgriSure
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30 font-bold">
                REGISTRATION
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Satellite × Agronomic AI × Parametric InsurTech
            </p>
          </div>
        </Link>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white pt-2">
          Create Your Platform Account
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Join farmers, underwriters, and field agents on the closed-loop resilience network.
        </p>
      </div>

      {/* Role Switcher Tabs */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#102820]/80 p-1.5 rounded-2xl border border-emerald-500/30 backdrop-blur-md">
          {(['FARMER', 'INSURER', 'FIELD_AGENT', 'ADMIN'] as Role[]).map((r) => {
            const isSelected = selectedRole === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => { setSelectedRole(r); setErrorMsg(null); }}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                  isSelected
                    ? 'bg-[#10B981] text-white shadow-lg shadow-emerald-950/60 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-sm">
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
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <Card3D depth={6} glowColor="rgba(16, 185, 129, 0.3)" className="glass-card-3d-dark border border-[#10B981]/40 shadow-2xl">
          <div className="p-6 sm:p-8 space-y-6">
            
            <div className="border-b border-emerald-900/60 pb-3 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white">
                  {selectedRole === 'FARMER' && '🧑‍🌾 Farmer Onboarding & Land Registry'}
                  {selectedRole === 'INSURER' && '🏛️ Institutional Insurer & Actuary Registration'}
                  {selectedRole === 'FIELD_AGENT' && '🔍 Field Verification Officer Onboarding'}
                  {selectedRole === 'ADMIN' && '⚙️ System Administrator Credentials'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedRole === 'FARMER' && 'Automatic enrollment in satellite monitoring and parametric PMFBY safety net.'}
                  {selectedRole === 'INSURER' && 'Direct access to Gram Panchayat risk maps and cryptographic claim packages.'}
                  {selectedRole === 'FIELD_AGENT' && 'Mobile crop cutting survey tool & GPS ground truth calibration.'}
                  {selectedRole === 'ADMIN' && 'Platform engine telemetry, broker queues, and model retraining.'}
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-xs text-red-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Row 1: Full Name & Primary Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={selectedRole === 'FARMER' ? 'e.g. Subhash Biswas' : 'e.g. Priya Sengupta'}
                    className="w-full px-3.5 py-2.5 bg-[#102820] border border-emerald-600/40 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    {selectedRole === 'FARMER' || selectedRole === 'FIELD_AGENT' ? 'Mobile Number (SMS / DBT) *' : 'Corporate Email Address *'}
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
                    className="w-full px-3.5 py-2.5 bg-[#102820] border border-emerald-600/40 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                  />
                </div>
              </div>

              {/* Farmer Specific Fields */}
              {selectedRole === 'FARMER' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        District (West Bengal) *
                      </label>
                      <select
                        value={district}
                        onChange={(e) => setDistrict(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#102820] border border-emerald-600/40 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                      >
                        <option value="Nadia">Nadia (Pilot District)</option>
                        <option value="Burdwan">Purba Bardhaman</option>
                        <option value="Hooghly">Hooghly</option>
                        <option value="Murshidabad">Murshidabad</option>
                        <option value="North 24 Parganas">North 24 Parganas</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Gram Panchayat / Village *
                      </label>
                      <input
                        type="text"
                        required
                        value={village}
                        onChange={(e) => setVillage(e.target.value)}
                        placeholder="e.g. Baganchra, Santipur Block"
                        className="w-full px-3.5 py-2.5 bg-[#102820] border border-emerald-600/40 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Primary Crop *
                      </label>
                      <select
                        value={primaryCrop}
                        onChange={(e) => setPrimaryCrop(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-[#102820] border border-emerald-600/40 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                      >
                        <option value="Aman Paddy">Aman Paddy (Monsoon Rice)</option>
                        <option value="Boro Paddy">Boro Paddy (Winter Rice)</option>
                        <option value="Potato">Potato (Kharif / Rabi)</option>
                        <option value="Jute">Jute</option>
                        <option value="Mustard">Mustard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                        Total Cultivated Area (Hectares) *
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        required
                        value={farmSizeHa}
                        onChange={(e) => setFarmSizeHa(e.target.value)}
                        placeholder="2.8"
                        className="w-full px-3.5 py-2.5 bg-[#102820] border border-emerald-600/40 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Bank IFSC & Account / UPI ID (for Direct DBT Parametric Payouts)
                    </label>
                    <input
                      type="text"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value)}
                      placeholder="e.g. State Bank of India - SBIN0001234 - A/C 38294819201"
                      className="w-full px-3.5 py-2.5 bg-[#102820] border border-emerald-600/40 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] font-mono"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      * Parametric indemnity settlements are disbursed directly to this account upon automated trigger verification.
                    </p>
                  </div>
                </>
              )}

              {/* Insurer Specific Fields */}
              {selectedRole === 'INSURER' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      Insurance Syndicate / Carrier Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Agriculture Insurance Co. of India"
                      className="w-full px-3.5 py-2.5 bg-[#102820] border border-emerald-600/40 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                      IRDAI Underwriting License ID *
                    </label>
                    <input
                      type="text"
                      required
                      value={licenseId}
                      onChange={(e) => setLicenseId(e.target.value)}
                      placeholder="e.g. IRDAI-AGR-2024-8842"
                      className="w-full px-3.5 py-2.5 bg-[#102820] border border-emerald-600/40 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Create Security Password *
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full px-3.5 py-2.5 bg-[#102820] border border-emerald-600/40 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-white font-bold text-sm shadow-xl shadow-[#10B981]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Creating Account...' : `Register & Activate ${selectedRole} Account`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="text-center pt-2 border-t border-emerald-900/60">
              <span className="text-xs text-slate-400">
                Already registered?{' '}
              </span>
              <Link href="/login" className="text-xs font-bold text-[#34D399] hover:underline">
                Sign in to your account &rarr;
              </Link>
            </div>

          </div>
        </Card3D>
      </div>

    </div>
  );
}
