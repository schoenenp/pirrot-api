const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    image:{type:String, required:true},
    categories:[{ type: mongoose.Types.ObjectId, required: true, ref: 'Category'}],
    variants:[{ type: mongoose.Types.ObjectId, required: true, ref: 'Variant'}]

},{ timestamps: {} });


module.exports = mongoose.model("Product", productSchema);
