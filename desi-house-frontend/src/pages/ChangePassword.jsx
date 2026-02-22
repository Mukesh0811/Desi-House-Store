import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ChangePassword() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.oldPassword || !form.newPassword || !form.confirmPassword) {
      alert("All fields are required");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/change-password/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            oldPassword: form.oldPassword,
            newPassword: form.newPassword
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to change password");
        return;
      }

      alert("Password changed successfully. Please login again.");
      localStorage.clear();
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-md mx-auto p-8">
        <h2 className="text-2xl font-bold text-maroon mb-6">
          Change Password
        </h2>

        <div className="bg-white p-6 rounded shadow">
          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={form.oldPassword}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded"
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={form.newPassword}
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full border p-2 mb-4 rounded"
          />

          <button
            onClick={handleSubmit}
            className="w-full bg-maroon text-white py-2 rounded-full"
          >
            Update Password
          </button>
        </div>
      </div>
    </>
  );
}
