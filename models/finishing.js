const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const finishingSchema = new Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    factor:{type:Number, required:true}
    
});


module.exports = mongoose.model("Finishing", finishingSchema);
