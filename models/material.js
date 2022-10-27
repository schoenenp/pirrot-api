const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const materialSchema = new Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    weight:{type:String},
    factor:{type:Number, required:true}
});


module.exports = mongoose.model("Material", materialSchema);
