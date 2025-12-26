'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/accessSlice';
import { useState } from 'react';
import Cookies from 'js-cookie';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

export function AdminSidebar({ activeMenu }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleLogout = () => {
    // Clear tokens and auth state
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    dispatch(logout());
    router.push('/auth/login');
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      id: 'products',
      label: 'Products',
      href: '/admin/products',
      icon: Package,
    },
    {
      id: 'orders',
      label: 'Orders',
      href: '/admin/orders',
      icon: ShoppingCart,
    },
  ];

  const sidebarContent = (
    <>
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-600 to-blue-600 flex items-center justify-center text-white font-bold">
            D
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">Digitech</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeMenu === item.id;

          return (
            <div>

            <Link
              key={item.id}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                  ? 'bg-gradient-to-r from-pink-600 to-blue-600 text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
                >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
                </div>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 flex-col bg-white border-r border-gray-200 h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2 rounded-lg bg-white border border-gray-200 shadow-md"
        >
          {isMobileOpen ? (
            <X className="w-6 h-6 text-gray-900" />
          ) : (
            <Menu className="w-6 h-6 text-gray-900" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 md:hidden overflow-y-auto">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
