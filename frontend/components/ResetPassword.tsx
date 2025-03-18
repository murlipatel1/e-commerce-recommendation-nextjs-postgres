"use client";
import { useState } from "react";
import api from "@/lib/api";
import { useRouter } from "next/router";


export default function ResetPassword() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const handleSubmit = async () => {
    try {
      const response = await api.post("otp/reset-password", { email, otp, newPassword });
      setMessage(response.data.message);
      router.push("/login");
    } catch (error) {
      console.log(error);
      setMessage("Error resetting password");
    }
  };
  return (
    <div className="container mx-auto px-4 py-8 ">
        <div className="grid grid-cols-1 gap-4 w-1/2">
      <h1>Reset Password</h1>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" />
      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" />
     
      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={handleSubmit}>Reset Password</button>
      <p>{message}</p>
      </div>
    </div>
  );
}
