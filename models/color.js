const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const colorSchema = new Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    hex:{type:String},
    factor:{type:Number, required:true}
});


module.exports = mongoose.model("Color", colorSchema);
