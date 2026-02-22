import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { UserAuthProvider } from "./context/UserAuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { CartProvider } from "./context/CartContext";   // 👈 add this

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserAuthProvider>
      <AdminAuthProvider>
        <CartProvider>   {/* 👈 wrap here */}
          <App />
        </CartProvider>
      </AdminAuthProvider>
    </UserAuthProvider>
  </BrowserRouter>
);
