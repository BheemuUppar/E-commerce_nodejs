const mongoose = require("mongoose");
const order = require("../models/Order");
const { v4: uuidv4 } = require('uuid');



function getDeliveryDate(){
  // Get current date
let currentDate = new Date();
// Add two days to the current date
currentDate.setDate(currentDate.getDate() + 2);
let options = { day: '2-digit', month: '2-digit', year: 'numeric' };
let futureDate = currentDate.toLocaleDateString('en-GB', options);
return futureDate;
}

async function saveOrder(data) {
  // const newId = uuidv4() // for generting id for cash on delivery
  try {
    if(data.paymentMode == 'online'){
      data.amount_paid = data.amount_due;
      data.amount_due = 0;
    }else{
      data.amount_paid = 0.0;
      data.id = generateOrderId()
    }
    data["orderStatus"]="success";
    data["currentStatus"]="ready to dispatch";
    data["deliveryDate"] = getDeliveryDate();
    data["orderDate"] = new Date().toLocaleString();
    data["quantity"] = getQuantity(data);
    let new_order = new order(data);
    let res = await new_order.save();
    return res;
  } catch (error) {
    console.log(error)
    return false;
  }
}

async function saveCashOnDeliveryOrder(req, res){
   try{
    let data = req.body;
   let order =  await  saveOrder(data);
    res.status(201).json(order)
   }catch(e){
    res.status(500).send('Internal Server Error')
   }
}

// Generate a random ID for orders
function generateOrderId() {
  return uuidv4();
}

function getQuantity(order){
let quantity = 0;
for(let i=0; i<order.products.length;i++){
  quantity += order.products[i].quantity
}

return quantity;
}

async function getOrders(req, res){
  let email = req.body.email;
  let data   = await order.find({'profile.email':email});
  console.log('data ', data)
  res.status(200).json(data);
}

module.exports = { saveOrder , getOrders , saveCashOnDeliveryOrder};
