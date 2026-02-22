const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const adminAuth = require("../middlewares/adminAuth");
const adminRole = require("../middlewares/adminRole");

// 🛒 Save order + Reduce stock (ATOMIC SAFE VERSION)
router.post("/save", async (req, res) => {
  try {
    const { userId, products, totalAmount, shippingDetails, paymentId } = req.body;

    console.log("Incoming order products:", products);

    // Normalize products
    const formattedProducts = products.map((item) => ({
      productId: item.productId || item._id,
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
    }));

    // 🧠 Step 1: Atomically reduce stock for ALL products
    const updatedProducts = [];

    for (let item of formattedProducts) {
      const updatedProduct = await Product.findOneAndUpdate(
        {
          _id: item.productId,
          stock: { $gte: item.quantity }, // ensure enough stock
        },
        {
          $inc: { stock: -item.quantity }, // decrease stock
        },
        { new: true }
      );

      if (!updatedProduct) {
        // ❌ Stock not enough or product missing → rollback previous updates
        for (let rollback of updatedProducts) {
          await Product.findByIdAndUpdate(rollback.productId, {
            $inc: { stock: rollback.quantity },
          });
        }

        return res.status(400).json({
          success: false,
          message: `${item.name} is out of stock or not enough quantity available`,
        });
      }

      updatedProducts.push({
        productId: item.productId,
        quantity: item.quantity,
      });
    }

    // 🧠 Step 2: Save order ONLY if stock deduction successful
    const newOrder = new Order({
      userId,
      products: formattedProducts,
      totalAmount: Number(totalAmount),
      shippingDetails,
      paymentId,
      orderStatus: "Processing",
    });

    await newOrder.save();

    console.log("Order saved safely:", newOrder._id);

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: newOrder._id,
    });
  } catch (err) {
    console.error("Order Save Error:", err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while placing order",
    });
  }
});



// 🔐 ADMIN: Get all orders
router.get("/admin/orders", adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products.productId")   // 🔥 IMPORTANT
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});


// 🔄 ADMIN: Update order status
router.put("/admin/update-status/:id", adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Status update failed" });
  }
});


// 📊 ADMIN: Orders Analytics
router.get("/admin/analytics", adminAuth, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const processing = await Order.countDocuments({ orderStatus: "Processing" });
    const shipped = await Order.countDocuments({ orderStatus: "Shipped" });
    const delivered = await Order.countDocuments({ orderStatus: "Delivered" });

    res.json({
      totalOrders,
      revenue: revenueData[0]?.totalRevenue || 0,
      processing,
      shipped,
      delivered,
    });
  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ message: "Failed to load analytics" });
  }
});


// 🔍 ADMIN: Get single order by ID (MUST BE LAST)
router.get("/admin/:id", adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.productId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order" });
  }
});


// 👤 USER: Get My Orders
router.get("/my-orders/:userId", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate("products.productId")   // 🔥 VERY IMPORTANT
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Fetch My Orders Error:", err);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
});

// 🗑 SUPERADMIN: Delete Delivered Order Only
router.delete("/admin/delete/:id", adminAuth, adminRole("superadmin"), async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Only allow deletion if order is Delivered
    if (order.orderStatus !== "Delivered") {
      return res.status(400).json({
        message: "Only delivered orders can be deleted",
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Delivered order deleted successfully",
    });
  } catch (err) {
    console.error("Delete Order Error:", err);
    res.status(500).json({ message: "Failed to delete order" });
  }
});


module.exports = router;
