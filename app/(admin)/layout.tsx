"use client";
import { useAuth } from '../contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect } from 'react';
import { LogOut, ShieldCheck } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/admin/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmed) {
      logout();
    }
  };

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
      <nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur shadow-sm">
        <div className="px-6">
          <div className="flex h-16 items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-xs text-gray-500">
                  Crown Standard Management
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-sm font-bold text-amber-700">
                  {user.email?.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Administrator
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.email}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                <LogOut className="h-4 w-4" />
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
function SidebarLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`block rounded-lg px-5 py-4 text-base font-semibold transition ${isActive
        ? "bg-amber-100 text-amber-700 border-l-4 border-amber-600"
        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
        }`}
    >
      {label}
    </Link>
  );
}
