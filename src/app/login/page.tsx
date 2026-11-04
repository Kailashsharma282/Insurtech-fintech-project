'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '@/context/RoleContext';
import { Role } from '@/lib/types';
import { 
  Sprout, 
  ShieldCheck, 
  UserCheck, 
  Search, 
  ArrowRight, 
  Lock, 
  Mail, 
  Phone,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  MapPin
} from 'lucide-react';

interface DemoAccount {
  role: Role;
  title: string;
  badge: string;
  name: string;
  identifier: string;
  password: string;
  description: string;
  targetUrl: string;
  colorClass: string;
}

const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    role: 'FARMER',
    title: 'Farmer Demo Account',
    badge: 'Kharif 2026 Pilot',
    name: 'Subhash Mondal (Plot #204)',
    identifier: 'farmer@agrisure.in',
    password: 'Farmer@2026',
    description: 'Aman Paddy 2.8 ha holding in Ghatal Village, Paschim Medinipur. Real-time soil probes & CHF monitoring.',
    targetUrl: '/farmer/dashboard',
    colorClass: 'border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-950',
  },
  {
    role: 'INSURER',
    title: 'Insurer Demo Account',
    badge: 'Underwriting Lead',
    name: 'Dr. S. Sen (Chief Underwriter)',
    identifier: 'insurer@agrisure.in',
    password: 'Insurer@2026',
    description: 'Underwrite policies across 40 Ghatal cadastral units. Automatic Silabati flood claim trigger appraisal.',
    targetUrl: '/insurer/dashboard',
    colorClass: 'border-blue-500 bg-blue-50/50 hover:bg-blue-50 text-blue-950',
  },
  {
    role: 'ADMIN',
    title: 'Admin Demo Account',
    badge: 'Operations & GEE',
    name: 'AgriSure Operations Administrator',
    identifier: 'admin@agrisure.in',
    password: 'Admin@2026',
    description: 'Full governance, Google Earth Engine telemetry feeds, IoT tick simulator, and smart contract settlement.',
    targetUrl: '/admin/overview',
    colorClass: 'border-purple-500 bg-purple-50/50 hover:bg-purple-50 text-purple-950',
  },
  {
    role: 'FIELD_AGENT',
    title: 'Field Inspector Demo Account',
    badge: '4th Role • CCE Inspector',
    name: 'Prabir Bhattacharya (Field Agronomist)',
    identifier: 'inspector@agrisure.in',
    password: 'Inspector@2026',
    description: 'Ground truth foliar diagnosis, Crop Cutting Experiments (CCE), and Silabati river flood assessment.',
    targetUrl: '/intelligence/map',
    colorClass: 'border-amber-500 bg-amber-50/50 hover:bg-amber-50 text-amber-950',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useRole();
  const [selectedRole, setSelectedRole] = useState<Role>('FARMER');
  const [identifier, setIdentifier] = useState('farmer@agrisure.in');
  const [password, setPassword] = useState('Farmer@2026');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleQuickLogin = async (account: DemoAccount) => {
    setSelectedRole(account.role);
    setIdentifier(account.identifier);
    setPassword(account.password);
    setLoading(true);
    setErrorMsg(null);

    const result = await login({
      role: account.role,
      identifier: account.identifier,
      password: account.password,
      name: account.name,
    });

    if (result.success) {
      router.push(account.targetUrl);
    } else {
      setErrorMsg(result.message || 'Login failed. Please check credentials.');
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const matched = DEMO_ACCOUNTS.find(a => a.role === selectedRole);

    const result = await login({
      role: selectedRole,
      identifier,
      password,
      name: matched?.name,
    });

    if (result.success) {
      const redirects: Record<Role, string> = {
        FARMER: '/farmer/dashboard',
        INSURER: '/insurer/dashboard',
        ADMIN: '/admin/overview',
        FIELD_AGENT: '/intelligence/map',
      };
      router.push(redirects[selectedRole] || '/farmer/dashboard');
    } else {
      setErrorMsg(result.message || 'Invalid credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header (Slate Navy & Royal Blue) */}
        <div className="bg-[#0F172A] text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-blue-400">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Ghatal Village Pilot • Paschim Medinipur, West Bengal</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mt-1.5 tracking-tight">
                AgriSure Demo Authentication Hub
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Click any of the <strong>4 verified demo accounts</strong> below to log in instantly with complete pre-configured telemetry, satellite layers, and underwriting permissions.
              </p>
            </div>
            <div className="shrink-0 bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-xl text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400 block font-bold">Pilot Season</span>
              <span className="text-xs font-mono font-bold text-emerald-400">Kharif 2025–2026</span>
            </div>
          </div>
        </div>

        {/* 4 Demo Account Cards (1-Click Login) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Select Demo Account to Sign In (1-Click)</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">4 Verified Personas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_ACCOUNTS.map((acc) => (
              <div
                key={acc.role}
                onClick={() => !loading && handleQuickLogin(acc)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 shadow-xs hover:shadow-md ${acc.colorClass}`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/80 border border-current/20">
                      {acc.badge}
                    </span>
                    {acc.role === 'FARMER' && <Sprout className="w-4 h-4 text-emerald-700" />}
                    {acc.role === 'INSURER' && <ShieldCheck className="w-4 h-4 text-blue-700" />}
                    {acc.role === 'ADMIN' && <Lock className="w-4 h-4 text-purple-700" />}
                    {acc.role === 'FIELD_AGENT' && <Search className="w-4 h-4 text-amber-700" />}
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 mt-2">
                    {acc.title}
                  </h3>
                  <div className="text-xs font-bold text-slate-800">
                    {acc.name}
                  </div>

                  <p className="text-[11px] text-slate-600 mt-1 leading-snug">
                    {acc.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-current/20 space-y-1.5">
                  <div className="text-[10px] font-mono text-slate-600">
                    <div>User: <strong>{acc.identifier}</strong></div>
                    <div>Pass: <strong>{acc.password}</strong></div>
                  </div>
                  
                  <button
                    type="button"
                    disabled={loading}
                    className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    {loading && selectedRole === acc.role ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <span>Sign In as {acc.role.replace('_', ' ')}</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manual Input Form (For custom testing or manual login) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 max-w-xl mx-auto">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900">
              Manual Credential Sign In
            </h3>
            <p className="text-xs text-slate-500">
              You can also type your credentials or select any demo role below.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleManualSubmit} className="space-y-4 text-xs">
            {/* Role Tab Selector */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                Target Role Persona
              </label>
              <div className="grid grid-cols-4 gap-1 bg-slate-100 p-1 rounded-xl font-semibold">
                {(['FARMER', 'INSURER', 'ADMIN', 'FIELD_AGENT'] as Role[]).map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setSelectedRole(r);
                      const acc = DEMO_ACCOUNTS.find(a => a.role === r);
                      if (acc) {
                        setIdentifier(acc.identifier);
                        setPassword(acc.password);
                      }
                    }}
                    className={`py-1.5 px-2 rounded-lg text-center transition-all ${
                      selectedRole === r 
                        ? 'bg-blue-600 text-white font-bold shadow-xs' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {r === 'FIELD_AGENT' ? 'Inspector' : r.charAt(0) + r.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Identifier (Email / Phone) */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                Email Address or Mobile Phone
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. farmer@agrisure.in"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">
                Account Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors shadow-sm text-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In with Credentials</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
