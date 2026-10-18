'use client';

import { SessionProvider, useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, PlusCircle, ShoppingCart, Star, LogOut, Loader2 } from 'lucide-react';
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
  ];

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 text-gray-900 dark:text-slate-100 overflow-hidden transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 dark:bg-slate-950 text-white flex flex-col hidden md:flex border-r border-slate-800">
        <div className="p-4 bg-slate-950 flex items-center gap-3 border-b border-slate-800">
          <div className="w-9 h-9 rounded-xl overflow-hidden bg-white shrink-0 shadow-xs">
            <img src="/images/logo.jpg" alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-white font-serif">New Khushi Resin</h1>
            <p className="text-xs text-slate-400">Admin Panel</p>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
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
        
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 px-3.5 py-2.5 w-full rounded-xl text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors text-sm font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout to Store
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile header */}
        <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 h-16 flex items-center justify-between px-6 md:hidden">
          <h1 className="font-bold text-gray-900 dark:text-white text-base font-serif">Admin Dashboard</h1>
          <button onClick={() => signOut({ callbackUrl: '/' })} className="p-2 text-gray-500 hover:text-rose-500 transition cursor-pointer">
            <LogOut className="w-5 h-5" />
          </button>
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

