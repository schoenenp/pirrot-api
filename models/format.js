const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const formatSchema = new Schema({
    title:{type:String, required:true},
    width:{type:Number, required:true},
    height:{type:Number, required:true},
    factor:{type:Number, required:true}
});


module.exports = mongoose.model("Format", formatSchema);
