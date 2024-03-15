const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/middleware");
const userController =require('../controllers/user')
const ordersControllers =require('../controllers/orders')
// route to add a product to cart
router.post("/addToCart", authMiddleware, userController.addToCart);

// route to remove a product from cart
router.post("/removeFromCart", authMiddleware, userController.removeFromCart );

router.post("/user", authMiddleware, userController.getUserDetails);
router.post("/cart", authMiddleware, userController.getCartList);

router.post("/orders", authMiddleware, ordersControllers.getOrders);

module.exports = router;
