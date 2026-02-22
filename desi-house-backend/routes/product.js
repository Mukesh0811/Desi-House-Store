const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const adminAuth = require("../middlewares/adminAuth");
const adminRole = require("../middlewares/adminRole");   // 🔥 ADD THIS
const upload = require("../middlewares/upload");


// ➕ Create Product (Admin + Superadmin)
router.post(
  "/admin/create",
  adminAuth,
  adminRole(["admin", "superadmin"]),   // 🔥 BOTH CAN MANAGE PRODUCTS
  upload.single("image"),
  async (req, res) => {
    try {
      const productData = {
        ...req.body,
        image: req.file
          ? `http://localhost:5000/uploads/${req.file.filename}`
          : req.body.image,
      };

      const product = new Product(productData);
      await product.save();

      res.json({ message: "Product created successfully", product });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


// 📄 Get All Products (Admin + Superadmin)
router.get(
  "/admin/all",
  adminAuth,
  adminRole(["admin", "superadmin"]),   // 🔥
  async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


// ✏️ Update Product (Admin + Superadmin)
router.put(
  "/admin/update/:id",
  adminAuth,
  adminRole(["admin", "superadmin"]),   // 🔥
  upload.single("image"),
  async (req, res) => {
    try {
      const updatedData = {
        ...req.body,
        image: req.file
          ? `http://localhost:5000/uploads/${req.file.filename}`
          : req.body.image,
      };

      const product = await Product.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );

      res.json({ message: "Product updated", product });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


// ❌ Delete Product (Admin + Superadmin)
router.delete(
  "/admin/delete/:id",
  adminAuth,
  adminRole(["admin", "superadmin"]),   // 🔥
  async (req, res) => {
    try {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: "Product deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);


// 🛍 Public: Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔍 Public: Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
