"use client";

import { useEffect, useState } from "react";
import { AdminUserProfile, UpdateUserPayload, usersApi } from "@/lib/usersApi";

interface Props {
  user: AdminUserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onUserUpdated: (user: AdminUserProfile) => void;
}

interface FormState {
  name: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "pending";
  approvalStatus: string;
  serviceRadiusKm: string;
  kycVerified: boolean;
}

const getInitialFormState = (user: AdminUserProfile): FormState => ({
  name: user.name || "",
  email: user.email || "",
  phone: user.phone || "",
  status: user.status,
  approvalStatus: user.providerProfile?.approvalStatus || "pending",
  serviceRadiusKm:
    typeof user.providerProfile?.serviceRadiusKm === "number"
      ? String(user.providerProfile.serviceRadiusKm)
      : "",
  kycVerified: Boolean(user.providerProfile?.kyc?.verified),
});

const UserModal = ({ user, isOpen, onClose, onUserUpdated }: Props) => {
  const [form, setForm] = useState<FormState | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      setForm(getInitialFormState(user));
    }
  }, [isOpen, user]);

  if (!isOpen || !user || !form) return null;

  const isProvider = user.role === "provider";
  const canEdit = user.role === "provider" || user.role === "customer";

  const handleChange = (field: keyof FormState, value: string | boolean) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSave = async () => {
    if (!canEdit) {
      onClose();
      return;
    }

    setSaving(true);
    try {
      const payload: UpdateUserPayload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        status: form.status,
      };

      if (isProvider) {
        payload.providerProfile = {
          approvalStatus: form.approvalStatus,
          serviceRadiusKm: Number(form.serviceRadiusKm) || 0,
          kyc: {
            verified: form.kycVerified,
          },
        };
      }

      const response = await usersApi.updateUser(user._id, payload);
      const updatedUser = response.data
        ? response.data
        : {
            ...user,
            name: payload.name,
            email: payload.email,
            phone: payload.phone,
            status: payload.status,
            providerProfile: payload.providerProfile ?? user.providerProfile,
            updatedAt: new Date().toISOString(),
          };

      onUserUpdated(updatedUser);
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to update user.";
      window.alert(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-6 shadow-lg">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-black"
        >
          x
        </button>

        <h2 className="mb-1 text-xl font-semibold">
          {canEdit ? "Edit User" : "User Details"}
        </h2>
        <p className="mb-6 text-sm text-gray-500">
          Role: <span className="capitalize">{user.role}</span>
        </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-gray-700">
            Name
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              disabled={!canEdit || saving}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Email
            <input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              disabled={!canEdit || saving}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Phone
            <input
              type="text"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              disabled={!canEdit || saving}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
            />
          </label>

          <label className="text-sm font-medium text-gray-700">
            Status
            <select
              value={form.status}
              onChange={(e) =>
                handleChange(
                  "status",
                  e.target.value as "active" | "inactive" | "pending"
                )
              }
              disabled={!canEdit || saving}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </label>
        </div>

        {isProvider && (
          <div className="mt-6 rounded-lg border border-gray-200 p-4">
            <h3 className="mb-4 font-semibold text-gray-900">Provider Profile</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-gray-700">
                Approval Status
                <select
                  value={form.approvalStatus}
                  onChange={(e) => handleChange("approvalStatus", e.target.value)}
                  disabled={saving}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>

              <label className="text-sm font-medium text-gray-700">
                Service Radius (km)
                <input
                  type="number"
                  min="0"
                  value={form.serviceRadiusKm}
                  onChange={(e) => handleChange("serviceRadiusKm", e.target.value)}
                  disabled={saving}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm disabled:bg-gray-100"
                />
              </label>

              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={form.kycVerified}
                  onChange={(e) => handleChange("kycVerified", e.target.checked)}
                  disabled={saving}
                />
                KYC verified
              </label>
            </div>
          </div>
        )}

        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
          <p>Created: {new Date(user.createdAt).toLocaleString()}</p>
          <p>Last updated: {new Date(user.updatedAt).toLocaleString()}</p>
          <p>Email verified: {user.emailVerified ? "Yes" : "No"}</p>
          <p>Phone verified: {user.phoneVerified ? "Yes" : "No"}</p>
          <p>Deleted: {user.isDeleted ? "Yes" : "No"}</p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          {canEdit && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserModal;
