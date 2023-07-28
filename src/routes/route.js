const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');

// console.log(htmlPaths)
router.get('', (req, res) => {
  res.send('App Running !');
});

router.get('/getProducts', async (req, res) => {
  try {
    const products = await Product.find({}).lean(); // Use .lean() to get plain JS objects
    // console.log(products);
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.json(err);
  }
});
router.get('/getProduct-By-category', async (req, res) => {
  let category =  req.query.category;
  console.log(category);
  const query = {
    category: { $regex: new RegExp(category, 'i') }
  };
  try {
    const products = await Product.find(query).lean(); // Use .lean() to get plain JS objects
    // console.log(products)
    if(products.length > 0){
      res.status(200).json({ success: true, data: products });
    }
    else{
      res.status(404).json({message:"Not Found"})
    }
    // console.log(products);
  } catch (err) {
    res.json(err);
  }
});
router.get('/getProduct-By-name', async (req, res) => {
  let name =  req.query.name;
  const query = {
    name: { $regex: new RegExp(name, 'i') }
  };
  try {
    const products = await Product.find(query).lean(); // Use .lean() to get plain JS objects
    // console.log(products)
    if(products.length > 0){
      res.status(200).json({ success: true, data: products });
    }
    else{
      res.status(404).json({message:"Not Found"})
    }
    // console.log(products);
  } catch (err) {
    res.json(err);
  }
});

router.post('/addProduct', async (req, res) => {
  let product = req.body;
//   console.log(product);
  try {
    const newProduct = await Product.create(product);
    res.status(201).json({
      success: true,
      message: 'Product added successfully!',
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add product.',
      error: error.message,
    });
  }
});

router.get('/getCategories' , async (req, res)=>{
  await Category.updateMany({}, [
    { $set: { imageString: { $toString: "$image" } } },
    { $unset: "image" },
    { $set: { image: "$imageString" } },
    { $unset: "imageString" }
  ]);

  console.log("Image field data type updated successfully.");
   let categories =  await Category.find({}).lean();
   console.log(categories)
   res.send(categories)
});
router.post('/addCategory', async (req, res) => {
    // let product = req.body;
  let category = req.body;
    try {
      const newProduct = await Category.create(category);
      res.status(201).json({
        success: true,
        message: 'Category added successfully!',
        data: newProduct,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to add product.',
        error: error.message,
      });
    }
  });

module.exports = router;
