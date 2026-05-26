import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, AlertCircle, CheckCircle, User as UserIcon, Check, Layers } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export default function Login({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(true); // Default to register as shown in the reference image
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setAgreeTerms(false);
    setError('');
    setSuccess('');
  };

  const handleToggleMode = (registerMode) => {
    setIsRegister(registerMode);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (isRegister) {
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (!agreeTerms) {
        setError('You must agree to the Terms of Service and Privacy Policy');
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? { name, email, password } : { email, password };

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          throw new Error(data.errors.map(err => err.msg).join(', '));
        }
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccess(isRegister ? 'Account created successfully! Switching to Login...' : 'Login successful!');
      
      if (!isRegister) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        resetForm();
        if (typeof onLoginSuccess === 'function') {
          onLoginSuccess(data.token, data.user);
        }
      } else {
        setTimeout(() => {
          setIsRegister(false);
          resetForm();
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans">
      
      {/* LEFT PANEL: HERO SECTION */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-700 via-purple-600 to-cyan-500 p-16 flex-col justify-between relative overflow-hidden select-none">
        
        {/* Animated background glows */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse duration-3000"></div>

        {/* Top: Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 bg-white/10 border border-white/20 text-white rounded-xl flex items-center justify-center shadow-lg backdrop-blur-sm">
            <Layers className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">TaskManager</span>
        </div>

        {/* Center: Hero copy */}
        <div className="space-y-8 relative z-10 my-auto text-left">
          <h1 className="text-5xl font-black tracking-tight text-white leading-tight">
            Get things done,<br />
            <span className="text-cyan-200">one task at a time.</span>
          </h1>
          
          <p className="text-white/80 text-lg leading-relaxed max-w-lg">
            Organize your work across Todo, In Progress, and Done — a clean board that keeps you focused on what matters.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 pt-4">
            <div className="flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold text-white shadow-sm transition-transform hover:scale-102">
              <Check className="w-4 h-4 text-cyan-300 shrink-0" />
              <span>Visual kanban board</span>
            </div>
            
            <div className="flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold text-white shadow-sm transition-transform hover:scale-102">
              <Check className="w-4 h-4 text-cyan-300 shrink-0" />
              <span>Priority tracking</span>
            </div>

            <div className="flex items-center gap-2 bg-white/10 border border-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-semibold text-white shadow-sm transition-transform hover:scale-102">
              <Check className="w-4 h-4 text-cyan-300 shrink-0" />
              <span>Instant updates</span>
            </div>
          </div>
        </div>

        {/* Bottom footer text */}
        <p className="text-white/60 text-xs font-medium tracking-wide relative z-10 text-left">
          Your tasks. Your pace. Your board.
        </p>
      </div>

      {/* RIGHT PANEL: FORM SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 bg-slate-50 relative overflow-y-auto">
        <div className="max-w-md w-full space-y-8 py-8">
          
          {/* Header text */}
          <div className="space-y-2 text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-slate-500 text-sm">
              {isRegister ? 'Get started — it takes less than a minute.' : 'Enter your credentials to access your account.'}
            </p>
          </div>

          {/* Segmented Switcher / Tabs */}
          <div className="bg-slate-200/60 border border-slate-200/40 p-1 rounded-2xl flex items-center shadow-inner">
            <button
              type="button"
              onClick={() => handleToggleMode(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                !isRegister 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleToggleMode(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                isRegister 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Register
            </button>
          </div>

          {/* Feedback alerts */}
          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs animate-fadeIn">
              <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
              <p className="font-semibold text-left">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl text-xs animate-fadeIn">
              <CheckCircle className="w-5 h-5 shrink-0 text-emerald-500" />
              <p className="font-semibold text-left">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Full name</label>
                <input
                  type="text"
                  required
                  placeholder="Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm shadow-sm"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email address</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-200/80 rounded-2xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
                {isRegister && (
                  <span className="text-[10px] text-slate-400 font-semibold">Minimum 6 characters.</span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder={isRegister ? 'Choose a strong password' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-slate-200/80 rounded-2xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200/80 rounded-2xl pl-4 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Checkboxes & Extra actions */}
            {isRegister ? (
              <label className="flex items-start gap-3 text-xs text-slate-500 hover:text-slate-700 cursor-pointer select-none py-1">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="accent-indigo-600 w-4 h-4 rounded border-slate-300 mt-0.5 focus:ring-indigo-500 cursor-pointer"
                />
                <span className="leading-relaxed">
                  I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500 font-bold">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500 font-bold">Privacy Policy</a>
                </span>
              </label>
            ) : (
              <div className="flex items-center justify-between text-xs py-1">
                <label className="flex items-center gap-2 text-slate-500 hover:text-slate-700 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    className="accent-indigo-600 w-4 h-4 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer" 
                  />
                  Remember me
                </label>
                <a href="#" className="text-indigo-600 hover:text-indigo-500 font-bold transition-colors">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 duration-200 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{isRegister ? 'Creating Account...' : 'Signing in...'}</span>
                </>
              ) : (
                <>
                  <span>{isRegister ? '+ Create Account' : 'Sign In'}</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Toggle Text */}
          <div className="text-center text-xs font-semibold">
            <p className="text-slate-500">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => handleToggleMode(!isRegister)}
                className="text-indigo-600 hover:text-indigo-500 font-bold transition-colors cursor-pointer"
              >
                {isRegister ? 'Sign in' : 'Register now'}
              </button>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
