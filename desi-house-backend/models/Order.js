const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true   // 🔥 This is the real ID we use
      },
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalAmount: Number,
  shippingDetails: {
    name: String,
    phone: String,
    address: String,
    city: String,
    pincode: String
  },
  paymentId: String,
  orderStatus: {
    type: String,
    default: "Processing"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
