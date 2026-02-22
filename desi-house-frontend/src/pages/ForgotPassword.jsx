import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      alert("Please enter your email");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      alert("OTP sent to your email");

      // 🔥 Redirect to OTP verification page
      navigate("/verify-otp", { state: { email } });

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6 text-maroon">Forgot Password</h2>

        <div className="bg-white p-6 rounded shadow">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-2 mb-4 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={handleSendOtp}
            className="w-full bg-maroon text-white py-2 rounded-full"
          >
            Send OTP
          </button>
        </div>
      </div>
    </>
  );
}
