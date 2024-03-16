const order = require("../models/Order");
const Razorpay = require("razorpay");
const environment = require("../../config/environment");
const ordersControllers = require("../controllers/orders");
const crypto = require("crypto");

const razorpay = new Razorpay({
  key_id: environment.razorpay.key_id,
  key_secret: environment.razorpay.key_secret,
});

async function verifyPayment(req, res) {
  try {
    const id = req.body.id;
    const paymentId = req.body.razorpay_payment_id;
    const secrete = razorpay.key_secret;
    const signature = req.body.razorpay_signature;
    let result = await generateSignature(id, paymentId, secrete, signature);
    let orderDetails = await ordersControllers.saveOrder(req.body);
    res.status(200).json({ message: result, orderDetails });
  } catch (e) {
    res.status(500).send("Internal Server Error");
  }
}

function generateSignature(
  order_id,
  razorpay_payment_id,
  secret,
  razorpay_signature
) {
  const payload = `${order_id}|${razorpay_payment_id}`;

  // Create an HMAC-SHA256 hash using the secret key
  const hmac = crypto.createHmac("sha256", secret); // sha256 is a hashing algorithm
  const generated_signature = hmac.update(payload).digest("hex");

  if (generated_signature == razorpay_signature) {
    return new Promise((resolve, reject) => {
      resolve("payment is successful");
    });
  } else {
    return new Promise((resolve, reject) => {
      reject("payment is failed");
    });
  }
}

module.exports = { verifyPayment };
