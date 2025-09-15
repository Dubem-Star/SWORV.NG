const express = require("express");
const axios = require("axios");
const { Paystack } = require("paystack-sdk");
const router = express.Router();
const ejs = require("ejs");
const { v4: uuidv4 } = require("uuid");
const { Order, DeliveryDetail } = require("./public/usermodels");
const path = require("path");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config();

const paystack = new Paystack(process.env.PAYSTACK_LIVE_SECRET_KEY);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const dbUrl = process.env.MONGODB_URL;
mongoose
  .connect(dbUrl)
  .then(() => console.log("Mongo connected"))
  .catch((e) => console.log("Error connecting Mongo"));

const generateReference = () => {
  return `PAY-${uuidv4()}`;
};

app.get("/", (req, res) => {
  res.render("home-page");
});

app.get("/shopPage", (req, res) => {
  res.render("shop-page");
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

app.get("/details", (req, res) => {
  res.render("details");
});

app.get("/paymentStatus", (req, res) => {
  res.render("payment-status-page");
});

// ROUTE TO CREATE ORDER ROUTE TO CREATE ORDER ROUTE TO CREATE ORDER ROUTE TO CREATE ORDER
app.post("/create-order", async (req, res) => {
  const cart = req.body;
  const amount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
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
      callback_url: "http://localhost:3000/paymentStatus",
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
      }
    );
    if (response.data) {
      console.log(response.data);
    }

    await Order.findOneAndUpdate(
      { orderId: orderId },
      {
        paystackRef: transactionReference,
        orderOwner: `${firstName} ${lastName}`,
      }
    );

    const deliveryDetails = await new DeliveryDetail(userShippingDetails);
    await deliveryDetails.save();

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
      }
    );

    const transactionData = await verificationResponse.data.data;

    if (transactionData.status === "success") {
      await Order.findOneAndUpdate(
        { paystackRef: reference },
        { status: "paid" }
      );
      res.json({ status: true, message: "transaction successfull" });
      console.log(
        `payment successfull, Order ${reference} has been updated to "paid"`
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

app.use(express.static(path.join(__dirname, "public")));

app.listen(3000, (req, res) => {
  console.log("listening on port 3k..");
});
