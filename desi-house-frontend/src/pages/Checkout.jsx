import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [stockMap, setStockMap] = useState({});
  const [outOfStock, setOutOfStock] = useState(false);

  // 🔒 Redirect to login
  useEffect(() => {
    if (!user || !token) navigate("/login");
  }, [user, token, navigate]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  // 🧮 Total
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 CHECK STOCK BEFORE PAYMENT
  const checkStock = async () => {
    try {
      const responses = await Promise.all(
        cart.map((item) =>
          fetch(`http://localhost:5000/api/products/${item._id}`).then((r) =>
            r.json()
          )
        )
      );

      const newStockMap = {};
      let stockIssue = false;

      responses.forEach((product, index) => {
        const cartItem = cart[index];
        newStockMap[cartItem._id] = product.stock;

        if (product.stock === 0 || cartItem.quantity > product.stock) {
          stockIssue = true;
        }
      });

      setStockMap(newStockMap);
      setOutOfStock(stockIssue);

      return !stockIssue;
    } catch (err) {
      console.error("Stock check failed", err);
      alert("Failed to check stock");
      return false;
    }
  };

  // 🧩 Razorpay loader
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 💳 Payment
  const handlePayment = async () => {
    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      alert("Please fill all details");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // 🔥 Stock validation
    const stockOk = await checkStock();
    if (!stockOk) {
      alert("Some items are out of stock. Please update your cart.");
      return;
    }

    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay SDK failed to load");
      return;
    }

    try {
      // Create Razorpay order
      const orderResponse = await fetch("http://localhost:5000/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      const orderData = await orderResponse.json();

      const options = {
        key: "rzp_test_RxlCmcJTZc3sSG",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "DESI HOUSE",
        description: "Ethnic Wear Purchase",
        order_id: orderData.id,

        handler: async function (rzpResponse) {
          const saveRes = await fetch("http://localhost:5000/api/orders/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user._id,
              products: cart.map((item) => ({
                productId: item._id,
                name: item.name,
                price: Number(item.price),
                quantity: Number(item.quantity),
              })),
              totalAmount: total,
              shippingDetails: form,
              paymentId: rzpResponse.razorpay_payment_id,
            }),
          });

          const saveData = await saveRes.json();

          if (!saveRes.ok || !saveData.success) {
            alert(saveData.message || "Stock conflict. Order cancelled.");
            return;
          }

          alert("Payment Successful! Order placed.");
          clearCart();
          window.location.href = "/success";
        },

        prefill: {
          name: form.name,
          contact: form.phone,
        },

        theme: { color: "#7A1E3A" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment Error:", err);
      alert("Something went wrong while processing payment.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-8 grid md:grid-cols-2 gap-10">
        {/* Shipping Form */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Shipping Details</h2>

          {["name", "phone", "city", "pincode"].map((f) => (
            <input
              key={f}
              name={f}
              placeholder={f.toUpperCase()}
              onChange={handleChange}
              className="w-full border p-2 mb-3 rounded"
            />
          ))}

          <textarea
            name="address"
            placeholder="Full Address"
            onChange={handleChange}
            className="w-full border p-2 mb-3 rounded"
          />
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

          {cart.map((item) => {
            const stock = stockMap[item._id];

            return (
              <div key={item._id} className="flex justify-between mb-2">
                <span>
                  {item.name} × {item.quantity}
                  {stock === 0 && (
                    <span className="text-red-600 text-sm block">
                      Out of Stock – Will be available soon
                    </span>
                  )}
                </span>
                <span>₹{Number(item.price).toLocaleString()}</span>
              </div>
            );
          })}

          <hr className="my-4" />

          <h3 className="text-xl font-bold">
            Total: ₹{total.toLocaleString()}
          </h3>

          <button
            onClick={handlePayment}
            disabled={outOfStock}
            className={`mt-4 w-full py-3 rounded-full transition ${
              outOfStock
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-maroon text-white hover:bg-gold"
            }`}
          >
            {outOfStock ? "Out of Stock" : "Pay Now"}
          </button>
        </div>
      </div>
    </>
  );
}
