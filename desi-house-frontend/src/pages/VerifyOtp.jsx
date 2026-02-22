import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function VerifyOtp() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 👁 Visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to reset password");
        return;
      }

      alert("Password reset successful. Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Failed to reset password");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-md mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6 text-maroon">Verify OTP</h2>

        <div className="bg-white p-6 rounded shadow">

          {/* OTP */}
          <input
            type="text"
            placeholder="Enter OTP"
            className="w-full border p-2 mb-3 rounded"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          {/* New Password */}
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter New Password"
              className="w-full border p-2 rounded pr-16"
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

          {/* Confirm Password */}
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              className="w-full border p-2 rounded pr-16"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2 text-sm text-maroon font-semibold"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            onClick={handleResetPassword}
            className="w-full bg-green-600 text-white py-2 rounded-full hover:opacity-90"
          >
            Reset Password
          </button>
        </div>
      </div>
    </>
  );
}
