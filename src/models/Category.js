const mangoose = require('mongoose');

const categorySchema   = new mangoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image:{type:String , required:true},
})


const category = mangoose.model( 'Category', categorySchema);

module.exports = category;




