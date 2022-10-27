const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const variantSchema = new Schema({
    material:{ type: mongoose.Types.ObjectId, required: true, ref: 'Material'},
    color: { type: mongoose.Types.ObjectId, required: true, ref: 'Color'},
    format: { type: mongoose.Types.ObjectId, required: true, ref: 'Format'},
    scales:[{
        amount:{type:Number, required:true},
        price:{type:Number, required: true},
    }],
    product:{type: mongoose.Types.ObjectId, required:true, ref: "Product"}

},{ timestamps: {} });


module.exports = mongoose.model("Variant", variantSchema);
