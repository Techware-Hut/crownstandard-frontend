"use client";
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [user, isLoading, router]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Nav */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">Admin Panel</h1>

            <div className="flex items-center space-x-6">
              <span className="text-sm text-gray-600">{user.email}</span>
              <button
                onClick={logout}
                className="text-sm font-medium text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 bg-white shadow-sm min-h-screen border-r">
          <nav className="mt-10">
            <div className="px-4 space-y-3">
              <SidebarLink href="/admin/dashboard" label="Dashboard" />
              <SidebarLink href="/admin/categories" label="Categories" />
              <SidebarLink href="/admin/users" label="Users" />
              <SidebarLink href="/admin/services" label="Services" />
              <SidebarLink href="/admin/bookings" label="Bookings" />
              <SidebarLink href="/admin/support-center" label="Support Center" />
            </div>
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}

/* Reusable Sidebar Item */
function SidebarLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="
        block
        px-5
        py-4
        text-base
        font-semibold
        text-gray-700
        rounded-lg
        hover:bg-gray-100
        hover:text-gray-900
        transition
      "
    >
      {label}
    </Link>
  );
}
