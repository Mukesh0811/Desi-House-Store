import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminVerifyOtp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁 toggle
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/admin/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp, newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Password reset successful");
      navigate("/admin/login");
    } else {
      alert(data.message || "OTP verification failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleReset} className="bg-white p-8 rounded shadow w-80 relative">
        <h2 className="text-xl font-bold mb-4 text-center">Verify Admin OTP</h2>

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full p-2 border mb-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-2 border mb-2 rounded"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        {/* 🔐 New Password with Show / Hide */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className="w-full p-2 border rounded pr-14"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-sm text-maroon font-semibold"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button className="w-full bg-maroon text-white p-2 rounded hover:opacity-90">
          Reset Password
        </button>
      </form>
    </div>
  );
}
