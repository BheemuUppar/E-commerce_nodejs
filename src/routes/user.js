const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/middleware");
const userController =require('../controllers/user')
const ordersControllers =require('../controllers/orders')
const productControllers = require('../controllers/product')
// route to add a product to cart
router.post("/addToCart", authMiddleware, userController.addToCart);

// route to remove a product from cart
router.post("/removeFromCart", authMiddleware, userController.removeFromCart );



router.post("/user", authMiddleware, userController.getUserDetails);
router.post("/addToWishlist", authMiddleware, userController.addToWishlist);
router.post("/wishlist", authMiddleware, userController.getWishlist);
router.post("/product-info", authMiddleware, userController.isExistInCartAndWishList); 

router.post("/cart", authMiddleware, userController.getCartList);

router.post("/orders", authMiddleware, ordersControllers.getOrders);
router.post("/order-cash", authMiddleware, ordersControllers.saveCashOnDeliveryOrder);


module.exports = router;
