export interface DeleteUserResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

export interface UpdateUserStatusResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}

export interface AdminUserProfile {
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

export interface UpdateUserPayload {
  name: string;
  email: string;
  phone?: string;
  status: "active" | "inactive" | "pending";
  providerProfile?: {
    approvalStatus: string;
    serviceRadiusKm: number;
    kyc: { verified: boolean };
  };
}

export interface UpdateUserResponse {
  success?: boolean;
  message?: string;
  data?: AdminUserProfile;
}

async function parseDeleteResponse(response: Response): Promise<DeleteUserResponse> {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return {
    success: response.ok,
    message: text || undefined,
  };
}

async function deleteRequest(path: string): Promise<DeleteUserResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}${path}`, {
    method: "DELETE",
    credentials: "include",
  });

  const payload = await parseDeleteResponse(response);

  if (!response.ok) {
    throw new Error(payload.message || "Delete request failed.");
  }

  return payload;
}

export const usersApi = {

  sendDeleteAccountOtp: async () => {
    try{
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/me/delete-otp`,  {method: "POST", credentials: "include"})
    }catch{
    }
  },


  deleteMyAccount: async (otp : string) => {
     try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/me/delete-account`,  {method: "DELETE", credentials: "include", body: JSON.stringify({ otp }), headers: { "Content-Type": "application/json" } })
        return data.json();
     }catch{

     }
  },

  deleteUserAccount: async (userId: string): Promise<DeleteUserResponse> => {
    return deleteRequest(`/users/${userId}`);
  },

  updateUserStatus: async (
    userId: string,
    status: "active" | "inactive" | "pending",
    approvalStatus?: string
  ): Promise<UpdateUserStatusResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/${userId}/approve`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        "approvalStatus": "approved",}),
    });

    const payload: UpdateUserStatusResponse =
      response.headers.get("content-type")?.includes("application/json")
        ? await response.json()
        : { success: response.ok };

    if (!response.ok) {
      throw new Error(payload.message || "Failed to update user status.");
    }

    return payload;
  },

  updateUser: async (
    userId: string,
    payload: UpdateUserPayload
  ): Promise<UpdateUserResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/${userId}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    const parsed: UpdateUserResponse =
      response.headers.get("content-type")?.includes("application/json")
        ? await response.json()
        : { success: response.ok };

    if (!response.ok) {
      throw new Error(parsed.message || "Failed to update user.");
    }

    return parsed;
  },
};
