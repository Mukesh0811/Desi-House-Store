import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const statusSteps = ["Processing", "Shipped", "Delivered"];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { admin, token } = useAdminAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!admin || !token) {
      navigate("/admin/login");
    }
  }, [admin, token, navigate]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/admin/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Failed to load order", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOrder();
  }, [id, token]);

  const updateStatus = async (status) => {
    try {
      await fetch(
        `http://localhost:5000/api/orders/admin/update-status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      setOrder({ ...order, orderStatus: status });
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <h2 className="text-center mt-10">Loading order...</h2>;
  if (!order) return <h2 className="text-center mt-10">Order not found</h2>;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <button
        onClick={() => navigate("/admin/orders")}
        className="mb-4 bg-gray-600 text-white px-4 py-2 rounded"
      >
        ← Back to Orders
      </button>

      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      {/* STATUS TIMELINE */}
      <div className="flex items-center gap-4 mb-6">
        {statusSteps.map((step, index) => {
          const isActive =
            statusSteps.indexOf(order.orderStatus) >= index;

          return (
            <div key={step} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                  isActive ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                {index + 1}
              </div>
              <span className={isActive ? "font-bold" : "text-gray-500"}>
                {step}
              </span>
              {index < statusSteps.length - 1 && (
                <div className="w-10 h-1 bg-gray-300"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* ORDER INFO */}
      <div className="bg-white p-6 rounded shadow">
        <p><b>Order ID:</b> {order._id}</p>
        <p><b>Status:</b> {order.orderStatus}</p>
        <p><b>Total:</b> ₹{order.totalAmount}</p>
        <p><b>Payment ID:</b> {order.paymentId}</p>

        <hr className="my-4" />

        <h2 className="text-xl font-bold">Customer</h2>
        <p>{order.shippingDetails.name}</p>
        <p>{order.shippingDetails.phone}</p>
        <p>
          {order.shippingDetails.address}, {order.shippingDetails.city} -{" "}
          {order.shippingDetails.pincode}
        </p>

        <hr className="my-4" />

        <h2 className="text-xl font-bold">Products</h2>
        {order.products.map((item, i) => (
          <p key={i}>
            {item.name} × {item.quantity}
          </p>
        ))}

        {/* CHANGE STATUS */}
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Update Order Status</h2>
          <div className="flex gap-3">
            {statusSteps.map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(s)}
                className={`px-4 py-2 rounded ${
                  order.orderStatus === s
                    ? "bg-green-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
