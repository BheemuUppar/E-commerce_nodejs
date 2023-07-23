const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const Product = require("./src/models/Product");
const environment = require('./config/environment');

// run express
const app = express();
// middlewares
app.use(cors());
// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const url =
  "mongodb+srv://bheemuk123:73vA689BIc1gppmf@cluster0.yrpks57.mongodb.net/E-commerce?retryWrites=true&w=majority";
// Connect to MongoDB Atlas
const client = mongoose
  .connect(environment.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas!");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB Atlas:", error);
  });

app.get("", (request, response) => {
  response.send("App Running !");
  response.end();
});

app.get("/getProducts", async (request, response) => {
  try {
    const products = await Product.find({}).lean(); // Use .lean() to get plain JS objects
    console.log(products);
    response.json({ success: true, data: products });
  } catch (err) {
    response.json(err);
  }
});

app.post("/addProduct", (request, response) => {
  let product = request.body;
  console.log(product);
  // response.send("ok")
  try {
    const newProduct = Product.create(product);
    response.json({
      success: true,
      message: "Product added successfully!",
      data: newProduct,
    });
  } catch (error) {
    response
      .status(500)
      .json({
        success: false,
        message: "Failed to add product.",
        error: error.message,
      });
  }
  response.end();
});

const PORT = environment.PORT | 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
