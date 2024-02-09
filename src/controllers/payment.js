var order = require("../models/Order");
var Razorpay = require("razorpay");
var environment = require("../../config/environment");
var ordersControllers = require("../controllers/orders");
var crypto = require("crypto");
const razorpay = new Razorpay({
  key_id: environment.razorpay.key_id,
  key_secret: environment.razorpay.key_secret,
});

async function verifyPayment(req, res) {
  const id = req.body.id;
  const paymentId = req.body.razorpay_payment_id;
  const secrete = razorpay.key_secret;
  const signature = req.body.razorpay_signature;
  let result = await generateSignature(id, paymentId, secrete, signature);
  let isSaved = await ordersControllers.saveOrder(req.body);
  console.log(isSaved);
  res.status(200).json({ message: result });
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
