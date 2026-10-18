'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Lock } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [text, setText] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        text,
        password,
      });

      if (res?.error) {
        setError('Invalid credentials. Please try again.');
      } else {
        router.push('/admin');
        router.refresh(); // Refresh to update session state in layout
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-violet-50/60 dark:bg-slate-950 px-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-violet-100 dark:border-violet-900/40 overflow-hidden">
        <div className="bg-gradient-to-br from-violet-950 via-violet-900 to-indigo-950 px-6 py-8 text-center relative">
          <div className="mx-auto w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4 overflow-hidden shadow-lg border-2 border-white/30">
            <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <h2 className="text-2xl font-bold text-white font-serif">Admin Dashboard</h2>
          <p className="text-violet-200 text-xs sm:text-sm mt-1">New Khushi Resin Creations</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800/50 p-3.5 rounded-xl text-xs font-semibold text-center">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                Admin ID / Username
              </label>
              <input
                type="text"
                required
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500"
                placeholder="e.g. admin"
              />
            </div>
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-600 text-gray-800 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white py-3.5 px-4 rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-violet-500 disabled:opacity-50 transition shadow-md cursor-pointer text-sm"
            >
              {loading ? 'Signing in...' : 'Sign In as Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

