import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/orders/my-orders/${user._id}`
        );
        const data = await res.json();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading orders:", err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center text-xl">
          Please login to view your orders.
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-10 text-center text-xl">Loading your orders...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6 text-maroon">My Orders</h2>

        {orders.length === 0 ? (
          <p>You have not placed any orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-5 rounded-lg shadow"
              >
                <div className="flex justify-between mb-2">
                  <p>
                    <b>Order ID:</b> {order._id}
                  </p>
                  <p>
                    <b>Status:</b>{" "}
                    <span className="text-maroon font-semibold">
                      {order.orderStatus}
                    </span>
                  </p>
                </div>

                <p>
                  <b>Date:</b>{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <p>
                  <b>Total:</b> ₹{order.totalAmount.toLocaleString()}
                </p>

                <div className="mt-3">
                  <b>Products:</b>
                  {order.products.map((item, i) => (
                    <p key={i}>
                      {item.name} × {item.quantity}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
