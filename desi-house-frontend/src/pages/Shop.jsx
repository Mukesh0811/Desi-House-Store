import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();

  // Get search keyword
  const searchQuery = new URLSearchParams(location.search).get("search") || "";
  // Get collection filter
  const collection = new URLSearchParams(location.search).get("collection");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });
  }, []);

  // 🔥 Filter products by search and new collection
  useEffect(() => {
    let result = products;

    // Search filter
    if (searchQuery) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // New Collection filter (last 7 days)
    if (collection === "new") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      result = result.filter(
        (p) => new Date(p.createdAt) >= sevenDaysAgo
      );
    }

    setFiltered(result);
  }, [products, searchQuery, collection]);

  if (loading) {
    return <h2 className="text-center mt-10">Loading products...</h2>;
  }

  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {collection === "new" ? "New Collection" : "Shop – DESI HOUSE"}
        </h1>

        {filtered.length === 0 ? (
          <p className="text-center text-gray-600">
            No products found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />

                <div className="p-4">
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p className="text-maroon font-bold text-xl">
                    ₹{product.price}
                  </p>

                  <Link
                    to={`/product/${product._id}`}
                    className="block text-center mt-3 bg-maroon text-white py-2 rounded-full hover:bg-gold transition"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
