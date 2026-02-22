import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Helper: convert price safely
  const parsePrice = (price) => {
    if (typeof price === "string") {
      return Number(price.replace("₹", "").replace(",", ""));
    }
    return Number(price);
  };

  const addToCart = (product) => {
  // normalize id
  const productId = product._id || product.id;

  if (!productId) {
    console.error("❌ Product ID missing:", product);
    alert("Product ID missing. Please refresh the page.");
    return;
  }

  const price = parsePrice(product.price);

  setCart((prev) => {
    const exists = prev.find((item) => item._id === productId);

    if (exists) {
      return prev.map((item) =>
        item._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    }

    return [
      ...prev,
      {
        _id: productId,        // 🔥 always Mongo ObjectId now
        name: product.name,
        price,
        image: product.image || "",
        quantity: 1,
      },
    ];
  });
};


  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item._id !== id));
  };

  const increaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0) // auto remove if qty becomes 0
    );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
