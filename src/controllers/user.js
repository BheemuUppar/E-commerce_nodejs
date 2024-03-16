const userDB = require("../models/User");

addToCart = async (req, res) => {
  let email = req.body.email;
  let productId = req.body.productId;
  let userData = await userDB.findOne({ email: email });
  if (userData?.cart?.length > 0) {
    let isExist = checkDuplicate(req, res, userData, productId, );
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
};

function checkDuplicate(req, res, userData, productId) {
  isExist = false;
  for (let i = 0; i < userData.cart.length; i++) {
    if (userData.cart[i].id == productId) {
      isExist = true;
      res.status(409).json({ message: "product Already Exist in Your Cart" });
      break;
    }
  }
  return isExist;
}

removeFromCart = async (req, res) => {
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
};

getUserDetails = async (req, res) => {
  let email = req.body.email;
  if (email) {
    let user = await userDB.findOne({ email: email });
    if (user) {
      let temp = JSON.parse(JSON.stringify(user));
      console.log(delete temp.password);

      res.json({ status: 200, data: temp });
    } else {
      res.json({ status: 404, message: "User Not Found" });
    }
  } else {
    res.json({ status: 404, message: "properties required" });
  }
};

getCartList = async (req, res) => {
  console.warn("requesting..");
  let email = req.body.email;
  if (email) {
    let user = await userDB.findOne({ email: email });
    if (user) {
      let temp = JSON.parse(JSON.stringify(user));
      console.log(delete temp.password);

      res.json({ status: 200, data: temp.cart });
    } else {
      res.json({ status: 404, message: "User Not Found" });
    }
  } else {
    res.json({ status: 404, message: "properties required" });
  }
};

isExistInCartAndWishList = async (req, res)=>{
// yet to implement
let email = req.body.email;
  let productId = req.body.productId;
  let userData = await userDB.findOne({ email: email });
  let result = {
    isExistInCart : null,
    isExistInWishlist : null
  }
  result.isExistInWishlist = userData.wishlist.some(item => item.id === productId);
  result.isExistInCart = userData.cart.some(item => item.id === productId);
  res.status(200).json(result)
}

addToWishlist = async (req, res) => {
  let email = req.body.email;
  let productId = req.body.productId;
  
  let userData = await userDB.findOne({ email: email });

  let isExist = userData.wishlist.some(item => item.id === productId);
  
  if (isExist) {
    // Remove product from wishlist
    let result = await userDB.updateOne(
      { email: email },
      { $pull: { wishlist: { id: productId } } }
    );
    res.status(200).json({ message: "Product removed from wishlist", result });
  } else {
    // Add product to wishlist
    let result = await userDB.updateOne(
      { email: email },
      { $push: { wishlist: { id: productId } } }
    );
    res.status(201).json({ message: "Product added to wishlist", result });
  }
}



module.exports = { addToCart, removeFromCart, getUserDetails, getCartList , isExistInCartAndWishList, addToWishlist};
