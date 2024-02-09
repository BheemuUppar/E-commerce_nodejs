var express = require("express");
var router = express.Router();
var order = require("../models/Order");
var Razorpay = require("razorpay");
var crypto = require("crypto");
var ordersControllers = require("../controllers/orders");
var paymentController = require("../controllers/payment");
var environment = require('../../config/environment')
const razorpay = new Razorpay({
    key_id: environment.razorpay.key_id,
    key_secret:environment.razorpay.key_secret,
});

function createOrder(options) {
  return new Promise((resolve, reject) => {
    razorpay.orders.create(options, (err, order) => {
      if (err) {
        console.error("Error creating order:", err);
        reject("Order could not be created");
      } else {
        resolve(order);
      }
    });
  });
}

router.post("/createOrder", async (req, res) => {
  let body = req.body;

  let obj = {
    amount: Number(body.amount), // Example amount in paisa (50 INR)
    currency: "INR",
    receipt: "order_receipt_1",
  };

  try {
    let new_order = new order(obj);
    // let orderDetails = await new_order.save();
    let orderDetails;

    try {
      orderDetails = await createOrder(obj);
      // Save orderDetails to the database if needed
      // await new_order.save();
      orderDetails = { ...orderDetails, ...req.body };
      res.status(201).json({ message: "Order Created", orderDetails });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error creating order" });
    }
  } catch (error) {
    console.warn(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/verify", async (req, res) => {
  paymentController.verifyPayment(req, res);
});

module.exports = router;
