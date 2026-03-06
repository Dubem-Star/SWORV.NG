const express = require("express");
const axios = require("axios");
const { Paystack } = require("paystack-sdk");
const router = express.Router();
const ejs = require("ejs");
const { v4: uuidv4 } = require("uuid");
const {
  Admin,
  Product,
  Order,
  DeliveryDetail,
} = require("./public/usermodels");
const path = require("path");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const mongoose = require("mongoose");
const session = require("express-session");
const crypto = require("crypto");
require("dotenv").config();
const bcrypt = require("bcrypt");
const mongoStore = require("connect-mongo");
const paystack = new Paystack(process.env.PAYSTACK_LIVE_SECRET_KEY);
let name;
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const dbUrl = process.env.MONGODB_URL;
mongoose
  .connect(dbUrl)
  .then(() => console.log("Mongo connected"))
  .catch((e) => console.log("Error connecting Mongo:", e));

app.use(
  session({
    secret: "sworvWears123",
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
      mongoUrl: dbUrl,
      collectionName: "sessions",
      ttl: 24 * 60 * 60,
      autoRemove: "native",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

function checkAuth(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).send("Unauthorized. please login");
  }
  next();
}

const generateReference = () => {
  return `PAY-${uuidv4()}`;
};

async function getLengths() {
  const totalProducts = await Product.countDocuments();
  const totalUsers = await DeliveryDetail.countDocuments();
  const confirmedOrders = await Order.countDocuments({
    orderOwner: { $ne: "loading..." },
  });
  const pendingOrders = await Order.countDocuments({
    orderOwner: "loading...",
  });

  return { totalProducts, totalUsers, confirmedOrders, pendingOrders };
}

app.get("/", (req, res) => {
  res.render("home-page");
});

app.get("/shopPage", async (req, res) => {
  try {
    const products = await Product.find();
    res.render("shop-page", { products });
  } catch (e) {
    console.error("Error fetching products:", e);
  }
});

app.get("/cart", (req, res) => {
  res.render("shopping-cart-page");
});

app.get("/lookbook", (req, res) => {
  res.render("lookbook");
});

app.get("/checkout", (req, res) => {
  res.render("checkout-page");
});

app.get("/details", async (req, res) => {
  try {
    const _id = req.query.id;
    const product = await Product.findById(_id);
    const products = await Product.find();
    if (product && products) {
      return res.render("details", { product, products });
    } else {
      return res.status(400).send("Product Not Found");
    }
  } catch (e) {
    console.error("Error fetching products:", e);
  }
});

app.get("/paymentStatus", (req, res) => {
  res.render("payment-status-page");
});

app.get("/admin", (req, res) => {
  res.render("admin/admin-login");
});

app.post("/admin-login-post", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await Admin.findOne({ username: username });

    if (!user)
      return res.status(404).json({ status: false, message: "User not found" });
    admin = user;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ status: false, message: "Invalid Username or Password" });

    req.session.userId = user._id;
    req.session.adminName = user.username;
    res.status(200).json({ status: true, message: `Welcome back ${username}` });
  } catch (e) {
    console.log("error:", e);
  }
});

app.get("/admin-dashboard", checkAuth, async (req, res) => {
  if (req.session.adminName) {
    name = req.session.adminName;
  }

  const products = await Product.find();
  const lengths = await getLengths();

  res.render("admin/admin-dashboard", {
    name,
    ...lengths,
    products,
  });
});

app.get("/admin-orders", async (req, res) => {
  const confirmedOrders = await Order.find({
    orderOwner: { $ne: "loading..." },
  });

  const lengths = await getLengths();

  res.render("admin/admin-orders", { confirmedOrders, ...lengths, name });
});

app.post("/fetch-products", async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById({ _id: productId });
    if (!product)
      return res.status(400).json({
        status: false,
        message: "error fetching product, product not found.",
      });

    res
      .status(200)
      .json({ status: true, message: "product successfully found.", product });
  } catch (e) {
    console.log("error:", e);
    return res.status(500).json({
      status: false,
      message: "error fetching product.",
    });
  }
});

app.post("/get-lengths", async (req, res) => {
  const { message } = req.body;

  const products = await Product.find();
  const totalProducts = products.length;

  res
    .status(200)
    .json({ status: true, message: "message length gotten.", totalProducts });
});

app.post("/delete-product", async (req, res) => {
  const { productName } = req.body;

  try {
    const product = await Product.findOneAndDelete({ title: productName });
    if (!product)
      return res.status(400).json({
        status: false,
        message: "error deleting product. product not found.",
      });

    res.status(200).json({
      status: true,
      message: "product deleted successfully.",
    });
  } catch (e) {
    console.log("error:", e);
    return res.status(500).json({
      status: false,
      message: "error deleting product.",
    });
  }
});

// ROUTE TO CREATE ORDER ROUTE TO CREATE ORDER ROUTE TO CREATE ORDER ROUTE TO CREATE ORDER
app.post("/create-order", async (req, res) => {
  const cart = req.body;
  const amount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  try {
    const newOrder = await new Order({
      products: cart,
      totalAmount: amount + 4000,
      status: "pending",
    });

    await newOrder.save();
    console.log(newOrder);

    res.status(201).json({ success: true, orderId: newOrder.orderId });
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "Unable to create an order" });
    console.log("Error saving Order:", e);
  }
});

// REQUEST TO PAYSTACK TO INITIALIZE PAYMENT REQUEST TO PAYSTACK TO INITIALIZE PAYMENT REQUEST TO PAYSTACK TO INITIALIZE PAYMENT

app.post("/initialize-payment", async (req, res) => {
  try {
    const { email, orderId, totalAmount, paymentMethod, userShippingDetails } =
      req.body;

    const { firstName, lastName } = userShippingDetails;

    const order = await Order.findOne({ orderId: orderId });

    if (!order) {
      return res
        .status(404)
        .json({ status: false, message: "Order not found in database" });
    }

    const transactionReference = generateReference();

    const paystackPayload = {
      email,
      amount: totalAmount * 100,
      reference: transactionReference,
      callback_url: "http://sworv-ng.onrender.com/paymentStatus",
    };

    if (paymentMethod === "Bank Transfer") {
      paystackPayload.channels = ["bank_transfer"];
    }

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      paystackPayload,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_LIVE_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    if (response.data) {
      console.log(response.data);
    }

    await Order.findOneAndUpdate(
      { orderId: orderId },
      {
        paystackRef: transactionReference,
        orderOwner: `${firstName} ${lastName}`,
      },
    );

    const deliveryDetails = await DeliveryDetail.findOneAndUpdate(
      { orderId: orderId },
      userShippingDetails,
      { new: true, upsert: true },
    );

    console.log(deliveryDetails);

    res.status(200).json({ status: true, data: response.data.data });
  } catch (error) {
    console.error("error:", error);
    console.log("error:", error);
    return res
      .status(500)
      .json({ status: false, message: "Payment initialization failed" });
  }
});

// REQUEST TO PAYSTACK TO VERIFY PAYMENT REQUEST TO PAYSTACK TO VERIFY PAYMENT REQUEST TO PAYSTACK TO VERIFY PAYMENT

app.post("/verifyPayment", async (req, res) => {
  const { reference } = req.body;
  const secret = process.env.PAYSTACK_LIVE_SECRET_KEY;
  try {
    const verificationResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${secret}`,
        },
      },
    );

    const transactionData = await verificationResponse.data.data;

    if (transactionData.status === "success") {
      await Order.findOneAndUpdate(
        { paystackRef: reference },
        { status: "paid" },
      );
      res.json({ status: true, message: "transaction successfull" });
      console.log(
        `payment successfull, Order ${reference} has been updated to "paid"`,
      );
    } else {
      console.log("payment unsuccessfull");
      res.json({ status: false, message: "transaction unsuccessfull" });
    }
  } catch (e) {
    console.error("Error verifying payment:", e.message);
    res.status(500).json({ status: false, message: "Verification failed" });
  }
});

app.post("/edit-product-name", async (req, res) => {
  const { productName, newName } = req.body;
  const product = await Product.findOneAndUpdate(
    { title: productName },
    { title: newName },
  );
  if (!product) {
    return res
      .status(400)
      .json({ status: false, message: "product not found" });
  }

  res.status(200).json({ status: true, message: "name updated successfully" });
});

app.post("/edit-product-price", async (req, res) => {
  const { productName, updatedPrice } = req.body;

  const product = await Product.findOneAndUpdate(
    { title: productName },
    { price: updatedPrice },
  );

  if (!product) {
    return res.status(400).json({
      status: false,
      message: "error updating price, product not found",
    });
  } else {
    res
      .status(200)
      .json({ status: true, message: "price updated successfully" });
  }
});

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, (req, res) => {
  console.log("listening on port 3k..");
});
