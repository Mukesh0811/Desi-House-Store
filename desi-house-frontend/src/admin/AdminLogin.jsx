import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👁 toggle
  const navigate = useNavigate();
  const { adminLogin } = useAdminAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      adminLogin(data.admin, data.token);
      navigate("/admin/orders");
    } else {
      alert(data.message || "Admin login failed");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow w-80"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>

        <input
          type="email"
          placeholder="Admin Email"
          className="w-full p-2 border mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* 🔐 Password with Show / Hide */}
        <div className="relative mb-2">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-2 border rounded pr-14"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        {/* Forgot Password */}
        <div className="text-right mb-4">
          <button
            type="button"
            onClick={() => navigate("/admin/forgot-password")}
            className="text-sm text-maroon hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <button className="w-full bg-maroon text-white p-2 rounded hover:opacity-90">
          Login
        </button>
      </form>
    </div>
  );
}
