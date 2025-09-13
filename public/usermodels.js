const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

// const productSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true },
//     description: String,
//     price: { type: Number, required: true },
//     images: [String],
//   },
//   { timestamps: true }
// );

// const userSchema = new mongoose.Schema(
//   {
//     email: { type: String, required: true, unique: true },
//     passwordHash: { type: String, required: true },
//     name: String,
//   },
//   { timestamps: true }
// );

// const cartItemSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Product",
//     required: true,
//   },
//   size: { type: String },
//   quantity: { type: Number, required: true, min: 1, default: 1 },
//   addedAt: { type: Date, default: Date.now },
// });

// const cartSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     items: [cartItemSchema],
//   },
//   { timestamps: true }
// );

const orderSchema = new mongoose.Schema({
  orderOwner: { type: String, required: true, default: "loading..." },
  products: [
    {
      title: { type: String, required: true },
      description: { type: String, required: true },
      price: { type: Number, required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "pending" },
  paystackRef: { type: String },
  orderId: { type: String, default: uuidv4 },
});

const deliveryDetailsSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  country: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  phoneNo: { type: String, required: true },
  zipCode: { type: String, required: true },
  modeOfPayment: { type: String, required: true },
  orderId: { type: String, require: true },
});

const Order = mongoose.model("Order", orderSchema);
const DeliveryDetail = mongoose.model("DeliveryDetails", deliveryDetailsSchema);

module.exports = { Order, DeliveryDetail };
