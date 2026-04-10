"use client";

import { usersApi } from "@/lib/usersApi";
import React, { useState } from "react";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type ApiResponse = {
  success: boolean;
  message?: string;
};

const DeleteAccountPage: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const router = useRouter();

  const clearUserSession = async () => {
      localStorage.removeItem("user");
      localStorage.removeItem("user_role");
      Cookies.remove("user_role");
      Cookies.remove("user_id");

      if (localStorage.getItem("google")) {
          localStorage.removeItem("google");
          await signOut({ redirect: false });
      }
  };

  const handleDelete = async (): Promise<void> => {
    if (!otp.trim()) {
      setMessage("Please enter OTP");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await usersApi.deleteMyAccount(otp);

      if (response.success) {
        setMessage("Account deleted successfully");
          await clearUserSession();
          window.alert(response.message || "Your account has been deleted.");
          router.push("/");
          router.refresh();
      } else {
        setMessage(response.message || "Invalid OTP");
      }
    } catch (error) {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Delete Account</h2>
        <p>Please enter the OTP sent to your email</p>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setOtp(e.target.value)
          }
          style={styles.input}
        />

        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            ...styles.button,
            backgroundColor: loading ? "#ccc" : "#e74c3c",
          }}
        >
          {loading ? "Deleting..." : "Delete Account"}
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

type Styles = {
  [key: string]: React.CSSProperties;
};

const styles: Styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    padding: "30px",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
    width: "300px",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "15px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    cursor: "pointer",
  },
  message: {
    marginTop: "15px",
    color: "#333",
  },
};

export default DeleteAccountPage;