// Create: app/(admin)/admin/users/page.tsx
"use client";
import { useState, useEffect, useCallback } from 'react';
import { usersApi } from '@/lib/usersApi';

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer' | 'provider';
  status: 'active' | 'inactive' | 'pending';
  emailVerified: boolean;
  phoneVerified: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  providerProfile?: {
    approvalStatus: string;
    kyc: { verified: boolean };
    serviceRadiusKm: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const defaultFilters = {
    role: '',
    status: '',
    search: '',
    page: 1,
    limit: 10
  };
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  const [filters, setFilters] = useState(defaultFilters);
  const [searchInput, setSearchInput] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users?${params}`, {
        credentials: 'include',
      });
      
      if (res.ok) {
        const data = await res.json();
        setUsers(data.data || []);
        setPagination(data.pagination || {});
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchInput.trim(),
      page: 1
    }));
  };

  const handleClear = () => {
    setSearchInput('');
    setFilters(defaultFilters);
  };

  const handleDeleteUser = async (user: User) => {
    const confirmed = window.confirm(
      `Delete ${user.name}'s account permanently? This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingUserId(user._id);
    try {
      const response = await usersApi.deleteUserAccount(user._id);
      setUsers((prev) => prev.filter((entry) => entry._id !== user._id));
      setPagination((prev) => ({
        ...prev,
        total: Math.max(0, prev.total - 1),
      }));
      window.alert(response.message || 'User account deleted successfully.');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to delete user account.';
      window.alert(message);
    } finally {
      setDeletingUserId(null);
    }
  };

  const handleApproveProvider = async (user: User) => {
    const confirmed = window.confirm(
      `Approve ${user.name} as a provider? They will be able to receive bookings.`
    );

    if (!confirmed) return;

    setUpdatingUserId(user._id);
    try {
      const response = await usersApi.updateUserStatus(user._id, "active", "active");
      setUsers((prev) =>
        prev.map((entry) =>
          entry._id === user._id
            ? {
                ...entry,
                status: "active",
                providerProfile: entry.providerProfile
                  ? { ...entry.providerProfile, approvalStatus: "active" }
                  : { approvalStatus: "active", kyc: { verified: false }, serviceRadiusKm: 0 },
              }
            : entry
        )
      );
      window.alert(response.message || "Provider approved successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to approve provider.";
      window.alert(message);
    } finally {
      setUpdatingUserId(null);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <div className="text-sm text-gray-600">
          Total: {pagination.total} users
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="provider">Provider</option>
            <option value="customer">Customer</option>
          </select>
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
          
          <input
            type="text"
            placeholder="Search users..."
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', e.target.value)}
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
          </select>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Users ({users.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.phone || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                      user.role === 'provider' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' :
                      user.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                    {user.role === "provider" && user.providerProfile?.approvalStatus && (
                      <div className="mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.providerProfile.approvalStatus === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          Provider: {user.providerProfile.approvalStatus}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div>
                      Email: {user.emailVerified ? '✓' : '✗'}
                    </div>
                    <div>
                      Phone: {user.phoneVerified ? '✓' : '✗'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4  whitespace-nowrap text-sm">
                    {user.email !== "admin@crownstandard.com" &&
                    user.role === "provider" &&
                    (user.status === "pending" || user.providerProfile?.approvalStatus === "pending") && (
                    <button
                      type="button"
                      onClick={() => handleApproveProvider(user)}
                      disabled={updatingUserId === user._id}
                      className="mb-2 rounded-md bg-green-600 px-3 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {updatingUserId === user._id ? 'Approving...' : 'Approve Provider'}
                    </button>
                    )}
                    {user.email !== "admin@crownstandard.com" &&
                    <button
                      type="button"
                      onClick={() => handleDeleteUser(user)}
                      disabled={deletingUserId === user._id}
                      className="rounded-md ml-5 bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {deletingUserId === user._id ? 'Deleting...' : 'Delete'}
                    </button>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
