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
  Sparkles,
  HelpCircle,
  KeyRound,
  Shield,
  Zap
} from 'lucide-react';
import { useRole } from '@/context/RoleContext';
import { Role } from '@/lib/types';
import { Card3D } from '@/components/ui/Card3D';
import { CyberBackground } from '@/components/ui/CyberBackground';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useRole();
  const [selectedRole, setSelectedRole] = useState<Role>('FARMER');
  const [identifier, setIdentifier] = useState<string>('+91 98321 44820');
  const [password, setPassword] = useState<string>('••••••••');
  const [useOtp, setUseOtp] = useState<boolean>(true);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpValue, setOtpValue] = useState<string>('4820');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const rolePresets: Record<Role, { title: string; subtitle: string; icon: any; defaultId: string; demoName: string; redirect: string }> = {
    FARMER: {
      title: 'Farmer Portal',
      subtitle: 'Nadia District & West Bengal Pilot Hub',
      icon: SproutIcon,
      defaultId: '+91 98321 44820',
      demoName: 'Rajesh Mondal (Plot #204)',
      redirect: '/farmer/dashboard',
    },
    INSURER: {
      title: 'Underwriter & Actuary Desk',
      subtitle: 'Portfolio Loss Ratio & Automated Parametric Settlement',
      icon: ShieldCheck,
      defaultId: 'p.sengupta@agrisure.in',
      demoName: 'Priya Sengupta (Lead Underwriter)',
      redirect: '/insurer/dashboard',
    },
    ADMIN: {
      title: 'Platform Operations & Systems Admin',
      subtitle: 'IoT Telemetry Fleet & Deep Learning Model Registry',
      icon: Cpu,
      defaultId: 'admin@agrisure.in',
      demoName: 'Dr. Arindam Banerjee (Systems Architect)',
      redirect: '/admin/overview',
    },
    FIELD_AGENT: {
      title: 'Field Verification & Survey Officer',
      subtitle: 'GPS Surveying, CCE Ground Truth & Disease Scouting',
      icon: UserCheck,
      defaultId: '+91 94330 19284',
      demoName: 'Bikram Sen (Field Surveyor FA-WB-441)',
      redirect: '/intelligence/map',
    },
  };

  function SproutIcon(props: any) {
    return <span {...props}>🧑‍🌾</span>;
  }

  const handleRoleSelect = (r: Role) => {
    setSelectedRole(r);
    setIdentifier(rolePresets[r].defaultId);
    setErrorMsg(null);
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    setErrorMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await login({
        role: selectedRole,
        identifier,
        passwordOrOtp: useOtp ? otpValue : password,
        name: rolePresets[selectedRole].demoName,
      });

      if (res.success) {
        router.push(rolePresets[selectedRole].redirect);
      } else {
        setErrorMsg(res.message || 'Authentication failed. Please verify credentials.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = (r: Role) => {
    handleRoleSelect(r);
    login({
      role: r,
      identifier: rolePresets[r].defaultId,
      name: rolePresets[r].demoName,
    }).then(() => {
      router.push(rolePresets[r].redirect);
    });
  };

  return (
    <div className="min-h-screen bg-[#071511] text-white flex flex-col justify-center py-12 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* 3D Cyber Background */}
      <CyberBackground variant="hero" showParticles={true} showGrid={true} />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
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
                LOGIN
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Satellite × Agronomic AI × Parametric InsurTech
            </p>
          </div>
        </Link>

        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white pt-2">
          Secure Portal Authentication
        </h2>
        <p className="text-xs sm:text-sm text-slate-300">
          Select your operational role to access your verified dashboard.
        </p>
      </div>

      {/* Role Selection Tabs */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#102820]/80 p-1.5 rounded-2xl border border-emerald-500/30 backdrop-blur-md">
          {(['FARMER', 'INSURER', 'FIELD_AGENT', 'ADMIN'] as Role[]).map((r) => {
            const isSelected = selectedRole === r;
            return (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleSelect(r)}
                className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center space-y-1 ${
                  isSelected
                    ? 'bg-[#10B981] text-white shadow-lg shadow-emerald-950/60 scale-[1.02]'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-sm">
                  {r === 'FARMER' ? '🧑‍🌾' : (r === 'INSURER' ? '🏛️' : (r === 'FIELD_AGENT' ? '🔍' : '⚙️'))}
                </span>
                <span className="truncate w-full text-center">
                  {r === 'FARMER' ? 'Farmer' : (r === 'INSURER' ? 'Insurer' : (r === 'FIELD_AGENT' ? 'Field Agent' : 'Admin'))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Login Card */}
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <Card3D depth={8} glowColor="rgba(16, 185, 129, 0.3)" className="glass-card-3d-dark border border-[#10B981]/40 shadow-2xl">
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Header info for selected role */}
            <div className="border-b border-emerald-900/60 pb-4 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-white flex items-center space-x-2">
                  <span>{rolePresets[selectedRole].title}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {rolePresets[selectedRole].subtitle}
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-[#34D399] border border-emerald-500/30 font-bold">
                {selectedRole}
              </span>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-xs text-red-200">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Identifier Input */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {selectedRole === 'FARMER' || selectedRole === 'FIELD_AGENT'
                    ? 'Registered Mobile Number'
                    : 'Corporate Work Email'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    {selectedRole === 'FARMER' || selectedRole === 'FIELD_AGENT' ? (
                      <Phone className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Mail className="w-4 h-4 text-emerald-400" />
                    )}
                  </div>
                  <input
                    type={selectedRole === 'FARMER' || selectedRole === 'FIELD_AGENT' ? 'tel' : 'email'}
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={selectedRole === 'FARMER' ? '+91 98321 44820' : 'name@company.com'}
                    className="w-full pl-10 pr-4 py-3 bg-[#102820] border border-emerald-600/40 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] font-mono"
                  />
                </div>
              </div>

              {/* Farmer OTP vs Password toggle */}
              {selectedRole === 'FARMER' && (
                <div className="flex items-center justify-between text-xs py-1">
                  <button
                    type="button"
                    onClick={() => setUseOtp(!useOtp)}
                    className="text-[#34D399] hover:underline font-semibold"
                  >
                    {useOtp ? 'Prefer to use Password instead?' : 'Switch to SMS OTP Login (Recommended)'}
                  </button>
                </div>
              )}

              {/* Password or OTP input */}
              {(!useOtp || (selectedRole !== 'FARMER' && selectedRole !== 'FIELD_AGENT')) ? (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Account Password
                    </label>
                    <a href="#" className="text-xs text-slate-400 hover:text-[#34D399]">
                      Forgot?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4 text-emerald-400" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-[#102820] border border-emerald-600/40 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      One-Time Password (OTP)
                    </label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="text-xs text-[#34D399] hover:underline font-semibold"
                    >
                      {otpSent ? 'Resend SMS OTP' : 'Send OTP via SMS'}
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <KeyRound className="w-4 h-4 text-emerald-400" />
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      placeholder="Enter 4-digit OTP"
                      className="w-full pl-10 pr-4 py-3 bg-[#102820] border border-emerald-600/40 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#10B981] font-mono tracking-widest text-center"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    * Rural SMS Gateway simulated: Default demo code is <strong className="text-emerald-300">4820</strong>.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#34D399] hover:to-[#10B981] text-white font-bold text-sm shadow-xl shadow-[#10B981]/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2"
              >
                <span>{loading ? 'Authenticating...' : `Enter as ${selectedRole}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick 1-Click Evaluation Login for Reviewers */}
            <div className="pt-2 border-t border-emerald-900/60 space-y-2.5">
              <div className="text-[11px] font-mono text-slate-400 text-center uppercase tracking-wider">
                Instant Demo Access (One-Click Credentials)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('FARMER')}
                  className="p-2.5 rounded-xl bg-[#102820] hover:bg-emerald-900/50 border border-emerald-800/40 text-left transition-colors"
                >
                  <div className="text-xs font-bold text-emerald-300">🧑‍🌾 Rajesh Mondal</div>
                  <div className="text-[10px] text-slate-400">Nadia Plot #204</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('INSURER')}
                  className="p-2.5 rounded-xl bg-[#102820] hover:bg-emerald-900/50 border border-emerald-800/40 text-left transition-colors"
                >
                  <div className="text-xs font-bold text-emerald-300">🏛️ Priya Sengupta</div>
                  <div className="text-[10px] text-slate-400">Lead Underwriter</div>
                </button>
              </div>
            </div>

            {/* Registration Link */}
            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">
                Don&apos;t have an account yet?{' '}
              </span>
              <Link href="/register" className="text-xs font-bold text-[#34D399] hover:underline">
                Register as Farmer or Insurer &rarr;
              </Link>
            </div>

          </div>
        </Card3D>
      </div>

    </div>
  );
}
