"use client";
import { useState } from "react";
import api from "@/lib/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await api.post("otp/forgot-password", { email });
      setMessage(response.data.message);
    } catch (error) {
        console.log(error);
      setMessage("Error sending OTP");
    }
  };

  return (
    <div>
      <h1>Forgot Password</h1>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
      <button onClick={handleSubmit}>Send OTP</button>
      <p>{message}</p>
    </div>
  );
}
