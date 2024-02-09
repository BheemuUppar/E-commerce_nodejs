const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/middleware");
const userController =require('../controllers/user')
// route to add a product to cart
router.post("/addToCart", authMiddleware, userController.addToCart);

// route to remove a product from cart
router.post("/removeFromCart", authMiddleware, userController.removeFromCart );

router.post("/user", authMiddleware, userController.getUserDetails);
router.post("/cart", authMiddleware, userController.getCartList);

module.exports = router;
