const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const productsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    image: [{ type: String, required: true }],
    description: { type: String, required: true },
    adminImg: { type: String },
  },

  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

const deliveryDetailsSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    phoneNo: { type: String, required: true },
    zipCode: { type: String, required: true },
    modeOfPayment: { type: String, required: true },
    orderId: { type: String, require: true },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
const DeliveryDetail = mongoose.model("DeliveryDetails", deliveryDetailsSchema);
const Product = mongoose.model("Products", productsSchema);
const Admin = mongoose.model("Admin", adminSchema);

module.exports = { Admin, Product, Order, DeliveryDetail };
