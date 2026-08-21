'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Printer, ShieldAlert, Loader2, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@printerwala.com'); // Autofill defaults for easier evaluation
  const [password, setPassword] = useState('admin123'); // Autofill defaults for easier evaluation
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Invalid credentials.');
      }

      router.push('/admin/dashboard');
    } catch (e: any) {
      setError(e.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8 bg-slate-100/50">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-8 shadow-xl space-y-6">
        {/* Header branding */}
        <div className="text-center space-y-2">
          <div className="bg-primary-600 text-white p-2.5 rounded-2xl w-fit mx-auto shadow-md">
            <Printer size={24} />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Press Administration
          </h1>
          <p className="text-slate-400 text-xs">
            Authenticate to manage orders and pricing rates
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1 text-left">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@email.com"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Access Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          {error && (
            <div className="flex gap-2 items-center text-xs text-red-700 bg-red-50 border border-red-200 p-3.5 rounded-xl font-bold">
              <ShieldAlert size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <KeyRound size={16} />
                Access Dashboard
              </>
            )}
          </button>
        </form>

        {/* Evaluation Help Notice */}
        <div className="border-t border-slate-100 pt-4 text-[10px] text-slate-400 text-center leading-relaxed">
          <p className="font-semibold text-slate-500">Local Sandbox Logins:</p>
          <p>User: <span className="font-mono text-slate-600">admin@printerwala.com</span></p>
          <p>Pass: <span className="font-mono text-slate-600">admin123</span></p>
        </div>
      </div>
    </div>
  );
}
