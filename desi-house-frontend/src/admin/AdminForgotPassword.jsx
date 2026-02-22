import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("http://localhost:5000/api/admin/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("OTP sent successfully to your email");

      // 🔥 Store email so next page can use it
      localStorage.setItem("adminResetEmail", email);

      // 🔥 Redirect to OTP verification page
      navigate("/admin/verify-otp");
    } else {
      alert(data.message || "Failed to send OTP");
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong");
  }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Admin Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter Admin Email"
          className="w-full p-2 border mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSendOtp}
          className="w-full bg-maroon text-white p-2 rounded"
        >
          Send OTP
        </button>
      </div>
    </div>
  );
}
