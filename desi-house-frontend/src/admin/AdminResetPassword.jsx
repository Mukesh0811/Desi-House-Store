import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function AdminResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁 Toggle state

  const handleReset = async () => {
    if (!otp || !newPassword) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Reset failed");
        return;
      }

      alert("Password reset successfully. Please login again.");
      navigate("/admin/login");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-80 relative">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Reset Admin Password
        </h2>

        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full p-2 border mb-3 rounded"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        {/* 🔐 Password with Show / Hide */}
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New Password"
            className="w-full p-2 border rounded pr-14"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-2 text-sm text-maroon font-semibold"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button
          onClick={handleReset}
          className="w-full bg-maroon text-white p-2 rounded hover:opacity-90"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}
