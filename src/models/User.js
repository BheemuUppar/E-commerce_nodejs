const mongoose = require('mongoose')


const mongooseSchema = mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},
    mobile:{type:Number},
    password:{type:String},
    wishlist:[{type:String}],
    cart:[{type:Object}],
    role:{type:String},
    orders:[{type:Object}],
    address:[{type:Object}]
 });
 const user = mongoose.model("users", mongooseSchema)

 module.exports = user;
// db.users.insertOne({
//     name:"test",
//     email:'test@gmail.com',
//     mobile:12345677,
//     password:"Test@123",
//     wishlist:[],
//     cart:[],
//     role:"customer",
//     orders:[],
//     address:[]
// })