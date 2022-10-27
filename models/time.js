const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const timesSchema = new Schema({
   day: {type: Date, required:true},
   periods:[{start:{type:String}, end:{type:String}}]
});


module.exports = mongoose.model("Time", timesSchema);
