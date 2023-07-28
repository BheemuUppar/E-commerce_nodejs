const mangoose = require('mongoose');

const categorySchema   = new mangoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image:{type:Buffer , required:true},
})


const category = mangoose.model( 'Category', categorySchema);

module.exports = category;




