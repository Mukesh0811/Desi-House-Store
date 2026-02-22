import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminManagement() {
  const { admin, token } = useAdminAuth();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);

  // Only superadmin can access
  useEffect(() => {
    if (!admin || admin.role !== "superadmin") {
      navigate("/admin/orders");
    }
  }, [admin, navigate]);

  // Fetch all admins
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/all", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setAdmins(data);
      } catch (err) {
        console.error("Failed to load admins:", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchAdmins();
  }, [token]);

  // Delete admin
  const deleteAdmin = async (id) => {
    if (!window.confirm("Are you sure you want to delete this admin?")) return;

    try {
      await fetch(`http://localhost:5000/api/admin/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAdmins(admins.filter((a) => a._id !== id));
    } catch (err) {
      alert("Failed to delete admin");
    }
  };

  // Change admin role
  const updateRole = async (id, role) => {
    try {
      await fetch(`http://localhost:5000/api/admin/update-role/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role }),
      });

      setAdmins(
        admins.map((a) => (a._id === id ? { ...a, role } : a))
      );
    } catch (err) {
      alert("Failed to update role");
    }
  };

  if (loading) {
    return <h2 className="text-center mt-10">Loading admins...</h2>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Management Panel</h1>

      <div className="bg-white rounded shadow">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => (
              <tr key={a._id} className="border-t">
                <td className="p-3">{a.email}</td>

                <td className="p-3">
                  <select
                    value={a.role}
                    onChange={(e) => updateRole(a._id, e.target.value)}
                    className="border px-2 py-1 rounded"
                    disabled={a._id === admin._id} // Superadmin can't downgrade itself
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </td>

                <td className="p-3">
                  {a._id !== admin._id && (
                    <button
                      onClick={() => deleteAdmin(a._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
