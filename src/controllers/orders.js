const mongoose = require("mongoose");
const order = require("../models/Order");

async function saveOrder(data) {
  try {
    let new_order = new order(data);
    let res = await new_order.save();
    console.log(res);
    return true;
  } catch (error) {
    console.log(error)
    return false;
  }
}

module.exports = { saveOrder };
