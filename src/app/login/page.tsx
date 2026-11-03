'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Satellite, 
  Phone, 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { useRole } from '@/context/RoleContext';
import { Role } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useRole();
  const [selectedRole, setSelectedRole] = useState<Role>('FARMER');
  const [identifier, setIdentifier] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const rolePresets: Record<Role, { 
    title: string; 
    subtitle: string; 
    icon: string; 
    placeholder: string; 
    redirect: string;
    sampleId: string;
    samplePass: string;
  }> = {
    FARMER: {
      title: 'Farmer Portal',
      subtitle: 'Ghatal Block, Paschim Medinipur • Plot #204 Aman Paddy',
      icon: '🧑‍🌾',
      placeholder: '+91 98321 44820',
      redirect: '/farmer/dashboard',
      sampleId: '+91 98321 44820',
      samplePass: 'Farmer@2026',
    },
    INSURER: {
      title: 'Underwriter & Actuary Desk',
      subtitle: 'Portfolio Loss Ratio & Parametric Settlement',
      icon: '🏛️',
      placeholder: 'underwriter@agrisure.in',
      redirect: '/insurer/dashboard',
      sampleId: 'underwriter@agrisure.in',
      samplePass: 'Insurer@2026',
    },
    ADMIN: {
      title: 'Platform Operations & Systems Admin',
      subtitle: 'Telemetry Infrastructure & Spatial Model Registry',
      icon: '⚙️',
      placeholder: 'admin@agrisure.in',
      redirect: '/admin/overview',
      sampleId: 'admin@agrisure.in',
      samplePass: 'Admin@2026',
    },
    FIELD_AGENT: {
      title: 'Field Verification Officer',
      subtitle: 'GPS Parcel Ground Truth & Damage Scouting',
      icon: '🔍',
      placeholder: '+91 94330 12345',
      redirect: '/intelligence/map',
      sampleId: '+91 94330 12345',
      samplePass: 'Agent@2026',
    },
  };

  const handleRoleSelect = (r: Role) => {
    setSelectedRole(r);
    setIdentifier('');
    setPassword('');
    setErrorMsg(null);
  };

  const fillPilotCredentials = () => {
    setIdentifier(rolePresets[selectedRole].sampleId);
    setPassword(rolePresets[selectedRole].samplePass);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await login({
        role: selectedRole,
        identifier: identifier.trim(),
        password: password,
      });

      if (res.success) {
        router.push(rolePresets[selectedRole].redirect);
      } else {
        setErrorMsg(res.message || 'Authentication failed. Please verify your credentials.');
      }
    } catch {
      setErrorMsg('Authentication service unavailable. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <Link href="/" className="inline-flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center text-white">
            <Satellite className="w-5 h-5" />
          </div>
          <div className="text-left">
            <span className="font-black text-2xl text-slate-900 tracking-tight block">
              AgriSure
            </span>
            <span className="text-[11px] text-slate-500 block">
              Ghatal Block &bull; Crop Health & Parametric Platform
            </span>
          </div>
        </Link>

        <h2 className="text-2xl font-black text-slate-900 pt-3">
          Sign In to Your Account
        </h2>
        <p className="text-xs text-slate-600">
          Select your role and enter your registered credentials.
        </p>
      </div>

      {/* Role Selection Tabs - Simple Clean Solid */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-200 p-1 rounded-xl">
          {(['FARMER', 'INSURER', 'FIELD_AGENT', 'ADMIN'] as Role[]).map((r) => {
            const isSelected = selectedRole === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleSelect(r)}
                className={`py-2 px-2 rounded-lg text-xs font-bold transition-colors flex flex-col items-center justify-center space-y-0.5 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-300'
                }`}
              >
                <span className="text-base">{rolePresets[r].icon}</span>
                <span className="truncate w-full text-center">
                  {r === 'FARMER' ? 'Farmer' : (r === 'INSURER' ? 'Insurer' : (r === 'FIELD_AGENT' ? 'Field Agent' : 'Admin'))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Login Card - Simple Solid White Box */}
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-300 shadow-sm space-y-5">
          
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                {rolePresets[selectedRole].title}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {rolePresets[selectedRole].subtitle}
              </p>
            </div>
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
            
            {/* Identifier Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {selectedRole === 'FARMER' || selectedRole === 'FIELD_AGENT'
                  ? 'Registered Mobile Number'
                  : 'Corporate Work Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  {selectedRole === 'FARMER' || selectedRole === 'FIELD_AGENT' ? (
                    <Phone className="w-4 h-4 text-slate-500" />
                  ) : (
                    <Mail className="w-4 h-4 text-slate-500" />
                  )}
                </div>
                <input
                  type={selectedRole === 'FARMER' || selectedRole === 'FIELD_AGENT' ? 'tel' : 'email'}
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={rolePresets[selectedRole].placeholder}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700 font-mono"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Account Password
                </label>
                <button
                  type="button"
                  onClick={fillPilotCredentials}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  Use Pilot Credentials
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-slate-500" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter account password"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Pilot Credentials Info Banner */}
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs flex items-center justify-between">
              <div>
                <span className="text-slate-500">Pilot Password:</span>{' '}
                <code className="text-emerald-800 font-mono font-bold">{rolePresets[selectedRole].samplePass}</code>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">PBKDF2 SHA-512</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-colors flex items-center justify-center space-x-2"
            >
              <span>
                {loading ? 'Verifying...' : `Sign In as ${selectedRole === 'FARMER' ? 'Farmer' : (selectedRole === 'INSURER' ? 'Insurer' : (selectedRole === 'FIELD_AGENT' ? 'Field Agent' : 'Admin'))}`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Registration Link */}
          <div className="text-center pt-2 border-t border-slate-200">
            <span className="text-xs text-slate-500">
              New pilot participant?{' '}
            </span>
            <Link href="/register" className="text-xs font-bold text-emerald-700 hover:underline">
              Register new entity &rarr;
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
