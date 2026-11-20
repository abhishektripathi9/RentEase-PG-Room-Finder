import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, ArrowRight, UserCheck, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fillDemoStudent = () => {
    setEmail('aarav.mehta@gmail.com');
    setPassword('User@123');
    setError('');
  };

  const fillDemoOwner = () => {
    setEmail('rohit.sharma@rentease.in');
    setPassword('User@123');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login(email, password);
      if (res.user?.role === 'owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#071917] flex flex-col items-center justify-center p-4 font-body text-slate-100 relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[#0D2623] border border-emerald-900/50 rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Brand */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3">
            <Building2 size={24} className="text-[#10B981]" />
          </Link>
          <h1 className="text-2xl font-black font-heading text-white tracking-tight">
            Sign In to RentEase <span className="text-[#10B981]">PRO</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">Student &amp; PG Owner Portal Access</p>
        </div>

        {/* Quick Demo Credentials Helpers */}
        <div className="mb-6 p-3 bg-emerald-950/50 rounded-2xl border border-emerald-800/40 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Sparkles size={14} />
            <span>Quick Demo Logins</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={fillDemoStudent}
              className="flex-1 py-1.5 px-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-[11px] font-bold text-slate-200 border border-slate-700 cursor-pointer"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={fillDemoOwner}
              className="flex-1 py-1.5 px-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-[11px] font-bold text-white cursor-pointer"
            >
              Demo PG Owner
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-950/50 border border-rose-800/40 rounded-xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@gmail.com"
                className="w-full bg-[#071917] border border-emerald-900/60 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-[#071917] border border-emerald-900/60 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#10B981] hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer font-heading"
          >
            {loading ? 'Authenticating...' : 'Sign In Now'}
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#10B981] font-bold hover:underline">
            Register as Student or Owner
          </Link>
        </div>

      </div>
    </div>
  );
}
