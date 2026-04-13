import axios from "./axios";

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
      const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/me/delete-otp`,  {method: "POST", credentials: "include"})
    }catch(e){
    }
  },


  deleteMyAccount: async (otp : string) => {
     try{
        const data = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/me/delete-account`,  {method: "DELETE", credentials: "include", body: JSON.stringify({ otp }), headers: { "Content-Type": "application/json" } })
        return data.json();
     }catch(e){

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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/users/${userId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        status,
        ...(approvalStatus ? { approvalStatus } : {}),
      }),
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
};
