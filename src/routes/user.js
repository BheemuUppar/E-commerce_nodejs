const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const userDB = require("../models/User");
const environment = require("../../config/environment");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/middleware");
const { default: mongoose } = require("mongoose");

// route to add a product to cart
router.post("/addToCart", authMiddleware, async (req, res) => {
  let email = req.body.email;
  let productId = req.body.productId;
  let userData = await userDB.findOne({ email: email });
  if (userData?.cart?.length > 0) {
    let isExist = false;
    for (let i = 0; i < userData.cart.length; i++) {
      if (userData.cart[i].id == productId) {
        isExist = true;
        res.status(409).json({ message: "product Already Exist in Your Cart" });
        break;
      }
    }
    if (isExist == false) {
      let result = await userDB.updateOne(
        { email: email },
        { $push: { cart: { id: productId } } }
      );
      res.status(201).json({ message: "prodcut added to cart", result });
    }
  } else {
    let result = await userDB.updateOne(
      { email: email },
      { $push: { cart: { id: productId } } }
    );
    res.status(201).json({ message: "prodcut added to cart", result });
  }
});

// route to remove a product from cart
router.post("/removeFromCart", authMiddleware, async () => {
  const email = req.body.email;
  const productId = req.body.productId;
  let result = await userDB.updateOne(
    { email: email },
    { $pull: { cart: { id: productId } } }
  );
  if (result) {
    res.status(200).json({ message: "product removed from the cart" });
  } else {
    res.status(500).json({ message: "Internal server Error" });
  }
});

router.post("/user", authMiddleware, async (req, res) => {
  let email = req.body.email;
  if (email) {
    let user = await userDB.findOne({ email: email });
    if (user) {
      let temp = JSON.parse(JSON.stringify(user));
      console.log(delete temp.password)
       
      res.json({ status: 200, data: temp });
    } else {
      res.json({ status: 404, message: "User Not Found" });
    }
  } else {
    res.json({ status: 404, message: "properties required" });
  }
});

module.exports = router;
