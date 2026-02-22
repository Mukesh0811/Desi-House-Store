import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { cart = [] } = useCart() || {};
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/shop?search=${search}`);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* 🔥 LOGO PLACEHOLDER */}
        <Link to="/" className="flex items-center gap-2">
          {/* Later replace src with your real logo */}
          <img
            src="/logo.png"
            alt="Desi House"
            className="h-12"
            onError={(e) => (e.target.style.display = "none")}
          />
          <span className="text-2xl font-bold text-maroon">DESI HOUSE</span>
        </Link>

        {/* 🔍 SEARCH BAR */}
        <input
          type="text"
          placeholder="Search ethnic wear..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
          className="hidden md:block w-1/3 px-4 py-2 border rounded-full"
        />

        <div className="flex items-center gap-6 relative">
          <Link to="/shop">Shop</Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="font-semibold text-maroon"
              >
                {user.name} ▼
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-40">
                  <button
                    onClick={() => navigate("/profile")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    My Profile
                  </button>

                  <button
                    onClick={() => navigate("/my-orders")}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    My Orders
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login">Login</Link>
          )}

          <Link
            to="/cart"
            className="relative bg-maroon text-white px-5 py-2 rounded-full"
          >
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-gold text-black text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
