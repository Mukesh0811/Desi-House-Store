import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(storedUser);

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: user.name || "",
    phone: user.phone || ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/update-profile/${user._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form)
        }
      );

      const data = await res.json();

      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      setEditing(false);
      alert("Profile updated successfully");
    } catch (err) {
      alert("Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <Navbar />

      <div className="max-w-4xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-maroon mb-6">My Profile</h2>

        <div className="bg-white p-8 rounded-xl shadow grid md:grid-cols-2 gap-8">

          {/* VIEW MODE */}
          {!editing && (
            <>
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-semibold">{user.name}</p>

                <p className="text-gray-500 mt-4">Phone</p>
                <p className="font-semibold">
                  {user.phone || "Not Provided"}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-semibold">{user.email}</p>

                <p className="text-gray-500 mt-4">User ID</p>
                <p className="text-sm text-gray-600">{user._id}</p>
              </div>

              <div className="col-span-2 flex flex-wrap gap-4 mt-6">
                <button
                  onClick={() => setEditing(true)}
                  className="bg-maroon text-white px-6 py-2 rounded-full"
                >
                  Edit Profile
                </button>

                <button
                  onClick={() => navigate("/change-password")}
                  className="bg-maroon text-white px-6 py-2 rounded-full"
                >
                  Change Password 
                </button>

                <button
                  onClick={() => navigate("/my-orders")}
                  className="bg-maroon text-white px-6 py-2 rounded-full"
                >
                  My Orders
                </button>

                <button
                  onClick={handleLogout}
                  className="bg-maroon text-white px-6 py-2 rounded-full"
                >
                  Logout
                </button>
              </div>
            </>
          )}

          {/* EDIT MODE */}
          {editing && (
            <div className="col-span-2">
              <h3 className="text-xl font-bold mb-4">Edit Profile</h3>

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full border p-2 rounded mb-3"
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full border p-2 rounded mb-4"
              />

              <div className="flex gap-4">
                <button
                  onClick={handleUpdate}
                  className="bg-green-600 text-white px-6 py-2 rounded-full"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-400 px-6 py-2 rounded-full"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
