const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const hoursSchema = new Schema({
    title:{type:String, required:true},
    times:[{type:mongoose.Types.ObjectId,ref:'Time', required:true}],
    store:{type: mongoose.Types.ObjectId, required: true, ref: 'Store'}
});


module.exports = mongoose.model("Hour", hoursSchema);
