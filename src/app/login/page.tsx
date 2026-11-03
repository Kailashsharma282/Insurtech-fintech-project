'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/farmer/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
        <div className="w-12 h-12 mx-auto rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Demo Mode Active</h2>
        <p className="text-xs text-slate-600">
          Sign-in barriers are disabled for this demo. Entering the Farmer Dashboard with verified dummy records...
        </p>
        <button
          onClick={() => router.push('/farmer/dashboard')}
          className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <span>Enter Farmer Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
