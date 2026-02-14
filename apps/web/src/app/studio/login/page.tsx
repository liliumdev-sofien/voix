'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Lock, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { email, password });
      const { accessToken } = response.data;
      localStorage.setItem('accessToken', accessToken);
      router.push('/studio/dashboard');
    } catch (err) {
      setError('Invalid credentials details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-100 rounded-full blur-[100px] opacity-50"></div>
         <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[100px] opacity-40"></div>
      </div>

      <div className="w-full max-w-md p-10 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-200/50 border border-white z-10 mx-4">
        <div className="text-center mb-10">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl mx-auto flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-4 transform rotate-3">
                <Sparkles size={24} />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome Back</h1>
            <p className="text-gray-500 mt-2 text-sm">Sign in to access your recording studio.</p>
        </div>

        {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-2 animate-in slide-in-from-top-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors group-focus-within:text-blue-600 text-gray-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-medium text-gray-900 placeholder:text-gray-400"
                placeholder="you@company.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors group-focus-within:text-blue-600 text-gray-400">
                <Lock size={18} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition font-medium text-gray-900 placeholder:text-gray-400"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 text-white rounded-xl hover:bg-black hover:scale-[1.02] transition-all font-bold shadow-lg shadow-gray-300 disabled:opacity-70 disabled:hover:scale-100 mt-2"
          >
            {loading ? (
                <>
                   <Loader2 size={20} className="animate-spin" />
                   Signing in...
                </>
            ) : (
                <>
                   Sign In <ArrowRight size={18} />
                </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
