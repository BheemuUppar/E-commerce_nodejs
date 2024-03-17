const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Category = require("../models/Category");
const users = require('../models/User');
const authMiddleware = require('../middlewares/middleware')
const productControllers = require('../controllers/product');


router.get("", (req, res) => {
  res.send("App Running !");
});

router.get("/getProducts", productControllers.getProducts);

router.get("/getProduct-By-category", productControllers.getProductsByCategory);

router.get("/getProduct-By-name", productControllers.getProductByName);


router.post("/getProducts-By-Ids",  productControllers.getProductsById);


router.post("/addProduct", productControllers.addProdcut);

router.get("/getCategories", productControllers.getCategories);

router.post("/addCategory", productControllers.addCategory);
router.post("/comment", authMiddleware, productControllers.addComment );
// router.get('/private', authMiddleware, async(req, res)=>{
//      res.send("this is private ")
//      res.end();
// });

module.exports = router;
