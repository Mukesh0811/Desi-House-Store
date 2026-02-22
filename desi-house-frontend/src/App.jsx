import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders";
import Profile from "./pages/MyProfile";
import ChangePassword from "./pages/ChangePassword";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";

/* Admin imports */
import AdminOrders from "./admin/AdminOrders";
import AdminLogin from "./admin/AdminLogin";
import AdminManagement from "./admin/AdminManagement";
import AdminAnalytics from "./admin/AdminAnalytics";
import AdminProducts from "./admin/AdminProducts";
import AdminForgotPassword from "./admin/AdminForgotPassword";
import AdminResetPassword from "./admin/AdminResetPassword";
import AdminVerifyOtp from "./admin/AdminVerifyOtp";
import AdminOrderDetails from "./admin/AdminOrderDetails";

const user = JSON.parse(localStorage.getItem("user"));

function App() {
  return (
    <Routes>
      {/* User Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/success" element={<Success />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/change-password" element={<ChangePassword />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
      <Route path="/admin/manage-admins" element={<AdminManagement />} />
      <Route path="/admin/analytics" element={<AdminAnalytics />} />
      <Route path="/admin/products" element={<AdminProducts />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
      <Route path="/admin/reset-password/:token" element={<AdminResetPassword />} />
      <Route path="/admin/verify-otp" element={<AdminVerifyOtp />} />
      <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
    </Routes>
  );
}

export default App;
