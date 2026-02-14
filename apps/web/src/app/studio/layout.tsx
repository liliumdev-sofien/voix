'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LayoutDashboard, FileText, Users, CheckSquare, LogOut, Mic, Database, Wand2 } from 'lucide-react';
import { clsx } from 'clsx';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token && !pathname.includes('/login')) {
      router.push('/studio/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  if (pathname.includes('/login')) {
    return <>{children}</>;
  }

  if (!isAuthenticated) return null;

  const navItems = [
    { name: 'Dashboard', href: '/studio/dashboard', icon: LayoutDashboard },
    { name: 'Record', href: '/studio/record', icon: Mic },
    { name: 'Sentences', href: '/studio/sentences', icon: FileText },
    { name: 'Assignments', href: '/studio/assignments', icon: Users },
    { name: 'QA', href: '/studio/qa', icon: CheckSquare },
    { name: 'Training', href: '/studio/admin/training', icon: Database },
    { name: 'Generate', href: '/studio/generate', icon: Wand2 },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-800">Voix Studio</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex items-center px-4 py-2 text-sm font-medium rounded-md group',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <Icon className={clsx('w-5 h-5 mr-3', isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500')} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              localStorage.removeItem('accessToken');
              router.push('/studio/login');
            }}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </button>
        </div>
      </div>
      <main className="flex-1 overflow-y-auto">
        <div className="px-8 py-6">{children}</div>
      </main>
    </div>
  );
}
