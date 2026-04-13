import React from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "admin" | "customer" | "provider";
  status: "active" | "inactive" | "pending";
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

interface Props {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

const UserModal: React.FC<Props> = ({ user, isOpen, onClose }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4">User Details</h2>

        {/* Basic Info */}
        <div className="space-y-2 text-sm">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone || "N/A"}</p>

          <p><strong>Role:</strong> 
            <span className="ml-2 capitalize">{user.role}</span>
          </p>

          <p><strong>Status:</strong> 
            <span className={`ml-2 px-2 py-1 rounded text-white text-xs ${
              user.status === "active"
                ? "bg-green-500"
                : user.status === "inactive"
                ? "bg-gray-500"
                : "bg-yellow-500"
            }`}>
              {user.status}
            </span>
          </p>

          <p><strong>Email Verified:</strong> {user.emailVerified ? "✅" : "❌"}</p>
          <p><strong>Phone Verified:</strong> {user.phoneVerified ? "✅" : "❌"}</p>
          <p><strong>Deleted:</strong> {user.isDeleted ? "Yes" : "No"}</p>

          <p><strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}</p>
          <p><strong>Updated At:</strong> {new Date(user.updatedAt).toLocaleString()}</p>
        </div>

        {/* Provider Profile */}
        {user.role === "provider" && user.providerProfile && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold mb-2">Provider Profile</h3>

            <p><strong>Approval Status:</strong> {user.providerProfile.approvalStatus}</p>
            <p>
              <strong>KYC Verified:</strong>{" "}
              {user.providerProfile.kyc.verified ? "✅" : "❌"}
            </p>
            <p>
              <strong>Service Radius:</strong>{" "}
              {user.providerProfile.serviceRadiusKm} km
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserModal;