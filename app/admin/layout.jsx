'use client';

import { AdminLayoutProvider } from '@/context/AdminLayoutContext';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminProtected } from '@/components/AdminProtected';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  
  // Determine active menu based on current path
  const getActiveMenu = () => {
    if (pathname === '/admin') return 'dashboard';
    if (pathname.startsWith('/admin/products')) return 'products';
    if (pathname.startsWith('/admin/orders')) return 'orders';
    if (pathname.startsWith('/admin/users')) return 'users';
    if (pathname.startsWith('/admin/settings')) return 'settings';
    return 'dashboard';
  };

  return (
    <AdminProtected>
      <AdminLayoutProvider>
        <div className="flex h-screen bg-gray-100">
          <AdminSidebar activeMenu={getActiveMenu()} />
          <div className="flex-1 flex flex-col overflow-y-auto">
            {children}
          </div>
        </div>
      </AdminLayoutProvider>
    </AdminProtected>
  );
}
