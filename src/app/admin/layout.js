'use client';

import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, PlusCircle, ShoppingCart, Star, LogOut, Loader2, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

function AdminLayoutContent({ children }) {
  const sessionContext = useSession();
  const session = sessionContext?.data;
  const status = sessionContext?.status || 'loading';
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (status === 'unauthenticated' && !isLoginPage) {
      router.push('/admin/login');
    }
  }, [status, isLoginPage, router]);

  if (status === 'loading' && !isLoginPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  // If it's the login page, render without sidebar
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If not authenticated (but still rendering), return null until redirect happens
  if (!session) {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Add Product', href: '/admin/products/new', icon: PlusCircle },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Exit to Store', href: '/', icon: Home, isHome: true },
  ];

  const handleLogoutToHome = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 text-gray-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 dark:bg-slate-950 text-white flex flex-col hidden md:flex border-r border-slate-800">
        <div className="p-4 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <button
            onClick={handleLogoutToHome}
            className="flex items-center gap-3 text-left group hover:opacity-90 transition cursor-pointer w-full"
            title="Click to go to Home Page (Auto Logout)"
          >
            <div className="w-9 h-9 rounded-xl overflow-hidden bg-white shrink-0 shadow-xs border border-violet-400/30">
              <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="font-bold text-sm text-white font-serif group-hover:text-violet-400 transition-colors">
                New Khushi Resin
              </h1>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Admin Panel</span>
              </p>
            </div>
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            if (item.isHome) {
              return (
                <button
                  key={item.name}
                  onClick={handleLogoutToHome}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all text-sm font-semibold w-full text-amber-300 hover:bg-amber-500/10 hover:text-amber-200 cursor-pointer mt-4 border border-amber-500/25 bg-amber-500/5 group"
                  title="Go to Home Page & Auto-Logout"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-mono uppercase tracking-wider">
                    Exit
                  </span>
                </button>
              );
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors text-sm font-medium',
                  isActive 
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold shadow-sm' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={handleLogoutToHome}
            className="flex items-center justify-between px-3.5 py-2 w-full rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
            title="Exit to store home page"
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-3.5 h-3.5 text-violet-400" />
              <span>Back to Store</span>
            </div>
            <span className="text-[10px] text-slate-500">Auto-Logout</span>
          </button>
          <button
            onClick={handleLogoutToHome}
            className="flex items-center gap-2.5 px-3.5 py-2 w-full rounded-xl text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors text-xs font-medium cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile header */}
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 sm:px-6 md:hidden">
          <h1 className="font-bold text-gray-900 dark:text-white text-base font-serif">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleLogoutToHome}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 flex items-center gap-1.5 transition cursor-pointer"
              title="Home Page (Auto Logout)"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </button>
            <button 
              onClick={handleLogoutToHome} 
              className="p-2 text-gray-500 hover:text-rose-500 transition cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 bg-slate-50 dark:bg-slate-950">
          {children}
        </div>
      </main>
    </div>
  );
}

export default function AdminLayout({ children }) {
  return (
    <SessionProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </SessionProvider>
  );
}

