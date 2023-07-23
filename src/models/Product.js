const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // _id:{type:String, required:true},
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category:{type:String , required:true},
    description: { type: String, required: true },
    images:[{type:Buffer , required:true}],
    specification:{type:Object }
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;