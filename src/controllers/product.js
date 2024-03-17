const Product = require("../models/Product");
const Category = require("../models/Category");
const User = require("../models/User");


getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).lean(); // Use .lean() to get plain JS objects
    res.status(200).json({ success: true, data: products });
  } catch (err) {
    res.json(err);
  }
};

getProductsByCategory = async (req, res) => {
  let category = req.query.category;
  const query = {
    category: { $regex: new RegExp(category, "i") },
  };
  try {
    const products = await Product.find(query).lean(); // Use .lean() to get plain JS objects
    if (products.length > 0) {
      res.status(200).json({ success: true, data: products });
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    res.json(err);
  }
};

getProductByName = async (req, res) => {
  let name = req.query.name;
  const query = {
    name: { $regex: new RegExp(name, "i") },
  };
  try {
    const products = await Product.find(query).lean(); // Use .lean() to get plain JS objects
    if (products.length > 0) {
      res.status(200).json({ success: true, data: products });
    } else {
      res.status(404).json({ message: "Not Found" });
    }
  } catch (err) {
    res.json(err);
  }
};

getProductsById = async (req, res) => {
  let productIds = req.body.productIds; // An array of product IDs

  try {
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    if (products.length > 0) {
      res.status(200).json({ success: true, data: products });
    } else {
      res
        .status(404)
        .json({ success: false, message: "No Products Found", data: [] });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error retrieving products",
      error: err,
    });
  }
};

addProdcut = async (req, res) => {
  let product = req.body;
  try {
    const newProduct = await Product.create(product);
    res.status(201).json({
      success: true,
      message: "Product added successfully!",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product.",
      error: error.message,
    });
  }
};

getCategories = async (req, res) => {
  await Category.updateMany({}, [
    { $set: { imageString: { $toString: "$image" } } },
    { $unset: "image" },
    { $set: { image: "$imageString" } },
    { $unset: "imageString" },
  ]);

  let categories = await Category.find({}).lean();
  res.send(categories);
};

addCategory = async (req, res) => {
  let category = req.body;
  try {
    const newProduct = await Category.create(category);
    res.status(201).json({
      success: true,
      message: "Category added successfully!",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add product.",
      error: error.message,
    });
  }
};

addComment = async(req, res)=>{
  let email = req.body.email;
  let productId = req.body.productId;
  let comment = req.body.comment;

  if(!(productId && comment && email)){
    res.status(400).json({message:'invalid Payload'})
  }

  try{
    let user = await User.findOne({email:email});
   comment.name = user.name;
   let date = new Date();
   comment.date = formatDate(date);
   comment.time = formatTime(date);
    let result = await Product.updateOne(
      { _id: productId },
      { $push: { reviews: comment } }
    );
    res.status(201).json({ message: "comment added", result });
  }catch(err){
    console.log(err)
    res.status(500).json({message:'failed to add comment try again'})
  }

}

function formatDate(date) {
  // Get day, month, and year components from the date
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  // Concatenate day, month, and year with '-' separator
  return `${day}-${month}-${year}`;
}

function formatTime(time) {
  // Get hours and minutes components from the time
  const hours = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');

  // Determine if it's AM or PM
  const period = hours >= 12 ? 'PM' : 'AM';

  // Convert hours to 12-hour format
  const formattedHours = hours % 12 || 12;

  // Concatenate hours and minutes with ':' separator and append AM/PM
  return `${formattedHours}:${minutes}${period}`;
}


module.exports = {
  getProducts,
  getProductsByCategory,
  getProductsById,
  getProductByName,
  addProdcut,
  getCategories,
  addCategory,
  addComment
};
