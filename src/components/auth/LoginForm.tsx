import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../ui/Button';
import { DEMO_USERS } from '../../api/mockAuth';
import { Lock, Mail, CheckCircle2, ShieldAlert, Sparkles, Eye, EyeOff, LayoutDashboard } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('manager@taskflow.internal');
  const [password, setPassword] = useState('manager123');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim()) {
      setFormError('Please enter your work email.');
      return;
    }
    if (!password) {
      setFormError('Please enter your password.');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setFormError('Invalid email or password. You can use the quick login presets below.');
    }
  };

  const handleQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setFormError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/30 mb-4 ring-8 ring-brand-500/10">
            <LayoutDashboard className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            TaskFlow
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Retail & Enterprise Task Management Dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl sm:px-10 text-white">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {formError && (
              <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3.5 flex items-start gap-3 text-rose-300 text-xs animate-in fade-in duration-200">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="leading-relaxed">{formError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Work Email
              </label>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@taskflow.internal"
                  required
                  className="block w-full pl-10 pr-3.5 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <span className="text-[11px] text-slate-400 font-mono">Demo: manager123</span>
              </div>
              <div className="relative rounded-xl shadow-xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full font-semibold shadow-lg shadow-brand-500/25 mt-2"
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Quick Login Presets */}
          <div className="mt-8 pt-6 border-t border-slate-700/60">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Quick Demo Logins (Click to Autofill):</span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {DEMO_USERS.map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => handleQuickLogin(demo.email, demo.passwordHash)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border text-left transition-all ${
                    email === demo.email
                      ? 'border-brand-500/80 bg-brand-500/10 text-white'
                      : 'border-slate-700/80 bg-slate-900/40 hover:bg-slate-900 hover:border-slate-600 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={demo.avatar}
                      alt={demo.name}
                      className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-600"
                    />
                    <div className="truncate">
                      <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1.5">
                        {demo.name}
                        <span className="text-[10px] text-slate-400 font-normal">({demo.role})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">{demo.email}</div>
                    </div>
                  </div>
                  {email === demo.email && (
                    <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
