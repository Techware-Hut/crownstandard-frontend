"use client";

import { useCallback, useEffect, useState } from "react";
import UserModal from "@/components/admin/usermodal";
import { AdminUserProfile, usersApi } from "@/lib/usersApi";

type User = AdminUserProfile;

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
    role: "",
    status: "",
    search: "",
    page: 1,
    limit: 10,
  };
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState(defaultFilters);
  const [searchInput, setSearchInput] = useState("");
  const [openUserModal, setOpenUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.role) params.append("role", filters.role);
      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      params.append("page", filters.page.toString());
      params.append("limit", filters.limit.toString());

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users?${params}`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(data.data || []);
        setPagination(data.pagination || {});
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: key === "limit" ? Number(value) : value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: searchInput.trim(),
      page: 1,
    }));
  };

  const handleClear = () => {
    setSearchInput("");
    setFilters(defaultFilters);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setOpenUserModal(true);
  };

  const handleUserUpdated = (updatedUser: User) => {
    setUsers((prev) =>
      prev.map((entry) => (entry._id === updatedUser._id ? updatedUser : entry))
    );
    setSelectedUser(updatedUser);
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
      window.alert(response.message || "User account deleted successfully.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to delete user account.";
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
                  : {
                      approvalStatus: "active",
                      kyc: { verified: false },
                      serviceRadiusKm: 0,
                    },
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
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <div className="text-sm text-gray-600">Total: {pagination.total} users</div>
      </div>

      <div className="mb-6 rounded-lg bg-white p-4 shadow">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={filters.role}
            onChange={(e) => handleFilterChange("role", e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="provider">Provider</option>
            <option value="customer">Customer</option>
          </select>

          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>

          <input
            type="text"
            placeholder="Search users..."
            className="rounded-md border border-gray-300 px-3 py-2"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />

          <select
            className="rounded-md border border-gray-300 px-3 py-2"
            value={filters.limit}
            onChange={(e) => handleFilterChange("limit", e.target.value)}
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
          </select>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow">
        <div className="border-b px-6 py-4">
          <h3 className="text-lg font-medium">Users ({users.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Verified
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {user.phone || "N/A"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "provider"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : user.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status}
                    </span>
                    {user.role === "provider" && user.providerProfile?.approvalStatus && (
                      <div className="mt-1">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            user.providerProfile.approvalStatus === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          Provider: {user.providerProfile.approvalStatus}
                        </span>
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div>Email: {user.emailVerified ? "Yes" : "No"}</div>
                    <div>Phone: {user.phoneVerified ? "Yes" : "No"}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {user.email !== "admin@crownstandard.com" &&
                      user.role === "provider" &&
                      (user.status === "pending" ||
                        user.providerProfile?.approvalStatus === "pending") && (
                        <button
                          type="button"
                          onClick={() => handleApproveProvider(user)}
                          disabled={updatingUserId === user._id}
                          className="mb-2 rounded-md bg-green-600 px-3 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {updatingUserId === user._id
                            ? "Approving..."
                            : "Approve Provider"}
                        </button>
                      )}
                    {user.email !== "admin@crownstandard.com" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user)}
                          disabled={deletingUserId === user._id}
                          className="ml-5 rounded-md bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {deletingUserId === user._id ? "Suspending..." : "Suspend"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleViewUser(user)}
                          disabled={deletingUserId === user._id}
                          className="ml-5 rounded-md bg-blue-600 px-3 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          Edit
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="rounded-md border border-gray-300 px-3 py-1 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="rounded-md border border-gray-300 px-3 py-1 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedUser && (
        <UserModal
          user={selectedUser}
          isOpen={openUserModal}
          onUserUpdated={handleUserUpdated}
          onClose={() => {
            setOpenUserModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}
