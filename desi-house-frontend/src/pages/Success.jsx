import { useEffect } from "react"
import { useCart } from "../context/CartContext"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"

export default function Success() {
  const { cart, removeFromCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    // Clear cart after successful payment
    cart.forEach(item => removeFromCart(item.id))
  }, [])

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-maroon mb-4">
          Payment Successful 🎉
        </h1>
        <p className="mb-6">
          Thank you for shopping with DESI HOUSE.
          Your order has been placed successfully.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-maroon text-white px-6 py-3 rounded-full hover:bg-gold transition"
        >
          Continue Shopping
        </button>
      </div>
    </>
  )
}
