import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <h2 className="text-center mt-10">Loading product...</h2>;
  }

  if (!product) {
    return <h2 className="text-center mt-10">Product not found</h2>;
  }

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-8 grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div>
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-xl shadow object-cover"
          />
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
          <p className="text-2xl text-maroon font-bold mb-4">
            ₹{product.price}
          </p>

          <p className="text-gray-700 mb-4">{product.description}</p>

          <p className="mb-2">
            <b>Category:</b> {product.category}
          </p>

          <p className="mb-4">
            <b>Stock:</b>{" "}
            {product.stock > 0 ? product.stock : "Out of stock"}
          </p>

          {product.stock > 0 ? (
            <button
              onClick={() =>
                addToCart({
                  id: product._id,
                  name: product.name,
                  price: Number(product.price),
                  image: product.image,
                })
              }
              className="bg-maroon text-white px-6 py-3 rounded-full hover:bg-gold transition"
            >
              Add to Cart
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-400 text-white px-6 py-3 rounded-full cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </>
  );
}
