import axios from "./axios";

export interface DeleteUserResponse {
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
  deleteMyAccount: async (otp : string) => {
     try{
        const data = await axios.delete("/auth/me", {data : {otp}})
        return data.data
     }catch(e){

     }
  },

  deleteUserAccount: async (userId: string): Promise<DeleteUserResponse> => {
    return deleteRequest(`/users/${userId}`);
  },
};
