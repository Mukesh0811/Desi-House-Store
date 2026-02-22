import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

export default function AdminOrders() {
  const { admin, token } = useAdminAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateAdmin, setShowCreateAdmin] = useState(false);

  // 🔐 Protect route
  useEffect(() => {
    if (!admin || !token) {
      navigate("/admin/login");
    }
  }, [admin, token, navigate]);

  // 📦 Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/orders/admin/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  // 🔄 Update order status
  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:5000/api/orders/admin/update-status/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
    } catch (err) {
      alert("Failed to update order status");
    }
  };

  // ❌ Delete order (Superadmin only)
  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this delivered order permanently?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/admin/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      alert(data.message || "Order deleted successfully");
      fetchOrders();
    } catch (err) {
      alert("Failed to delete order");
    }
  };

  if (loading) {
    return <h2 className="text-center mt-10">Loading orders...</h2>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Orders Dashboard</h1>

        <div className="flex gap-4">
          {/* Visible to both admin & superadmin */}
          <button
            onClick={() => navigate("/admin/products")}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Manage Products
          </button>

          {/* Superadmin only */}
          {admin?.role === "superadmin" && (
            <>
              <button
                onClick={() => navigate("/admin/analytics")}
                className="bg-maroon text-white px-4 py-2 rounded"
              >
                View Analytics
              </button>

              <button
                onClick={() => setShowCreateAdmin(true)}
                className="bg-maroon text-white px-4 py-2 rounded"
              >
                + Create New Admin
              </button>

              <button
                onClick={() => navigate("/admin/manage-admins")}
                className="bg-maroon text-white px-4 py-2 rounded"
              >
                Manage Admins
              </button>
            </>
          )}
        </div>
      </div>

      {/* ORDERS LIST */}
      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => navigate(`/admin/orders/${order._id}`)}
              className="bg-white p-4 rounded shadow cursor-pointer hover:bg-gray-100"
            >
              <div className="flex justify-between mb-2">
                <p>
                  <b>Order ID:</b> {order._id}
                </p>
                <p>
                  <b>Status:</b> {order.orderStatus}
                </p>
              </div>

              <p><b>Total:</b> ₹{order.totalAmount}</p>
              <p><b>Payment ID:</b> {order.paymentId}</p>

              <div className="mt-2">
                <b>Customer:</b>
                <p>{order.shippingDetails?.name}</p>
                <p>{order.shippingDetails?.phone}</p>
                <p>
                  {order.shippingDetails?.address},{" "}
                  {order.shippingDetails?.city} -{" "}
                  {order.shippingDetails?.pincode}
                </p>
              </div>

              <div className="mt-2">
                <b>Products:</b>
                {order.products?.map((item, i) => (
                  <p key={i}>
                    {item.name} × {item.quantity}
                  </p>
                ))}
              </div>

              {/* STATUS + DELETE BUTTONS */}
              <div
                className="mt-4 flex gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => updateStatus(order._id, "Processing")}
                  className="bg-yellow-400 px-3 py-1 rounded"
                >
                  Processing
                </button>

                <button
                  onClick={() => updateStatus(order._id, "Shipped")}
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Shipped
                </button>

                <button
                  onClick={() => updateStatus(order._id, "Delivered")}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Delivered
                </button>

                {/* ❌ Delete only if Superadmin & Delivered */}
                {admin?.role === "superadmin" &&
                  order.orderStatus === "Delivered" && (
                    <button
                      onClick={() => deleteOrder(order._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete Order
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE ADMIN MODAL */}
      {showCreateAdmin && admin?.role === "superadmin" && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="text-xl font-bold mb-4">Create New Admin</h2>

            <input
              id="newAdminEmail"
              placeholder="Email"
              className="w-full border p-2 mb-3"
            />

            <input
              id="newAdminPassword"
              type="password"
              placeholder="Password"
              className="w-full border p-2 mb-3"
            />

            <select id="newAdminRole" className="w-full border p-2 mb-4">
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreateAdmin(false)}
                className="bg-gray-300 px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  const email =
                    document.getElementById("newAdminEmail").value;
                  const password =
                    document.getElementById("newAdminPassword").value;
                  const role =
                    document.getElementById("newAdminRole").value;

                  try {
                    const res = await fetch(
                      "http://localhost:5000/api/admin/create",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ email, password, role }),
                      }
                    );

                    const data = await res.json();
                    alert(data.message || "Admin created successfully");
                    setShowCreateAdmin(false);
                  } catch (err) {
                    alert("Failed to create admin");
                  }
                }}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
