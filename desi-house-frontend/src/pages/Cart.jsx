import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto p-8">
        <h2 className="text-3xl font-bold text-maroon mb-6">Your Cart</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-6">
              {cart.map((item) => (
  <div
    key={item._id}   // 🔥 IMPORTANT
    className="flex items-center justify-between bg-white p-5 rounded-lg shadow"
  >
    {/* Product Info */}
    <div>
      <h3 className="font-semibold">{item.name}</h3>
      <p className="text-maroon font-bold">₹{item.price}</p>
    </div>

    {/* Quantity Controls */}
    <div className="flex items-center gap-3">
      <button
        onClick={() => decreaseQty(item._id)}
        className="px-3 py-1 bg-gray-200 rounded"
      >
        -
      </button>

      <span className="font-semibold">
        {item.quantity}
      </span>

      <button
        onClick={() => increaseQty(item._id)}
        className="px-3 py-1 bg-gray-200 rounded"
      >
        +
      </button>
    </div>

    {/* Remove Button */}
    <button
      onClick={() => removeFromCart(item._id)}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Remove
    </button>
  </div>
))}

            </div>

            {/* Total & Checkout */}
            <div className="mt-8 text-right">
              <h3 className="text-xl font-bold">
                Total: ₹{total.toLocaleString()}
              </h3>

              <button
                onClick={() => navigate("/checkout")}
                className="mt-4 bg-maroon text-white px-8 py-3 rounded-full hover:bg-gold transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
