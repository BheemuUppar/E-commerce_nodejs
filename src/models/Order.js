var mongoose = require("mongoose");

let orderSchema = mongoose.Schema(
  {
    _id: { type: mongoose.Types.ObjectId, auto: true },
    id: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    products: { type: Array, required: true },

    profile: { type: Object, required: true },
    deliveryAddress: { type: String },
    paymentMode: { type: String },
    paymentStatus: { type: String },
    transactionID: { type: String },
  },
  { strict: false }
);

let order = mongoose.model("Order", orderSchema);
module.exports = order;
