const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const storeSchema = new Schema({
    title:{type: String, required: true},
    status:{type:String, required:true},
    image:{type:String, required:true},
    contact:{
        email: {type:String, required:true},
        phone: {type:Number, required:true}
    },
    team:{ type: mongoose.Types.ObjectId, ref: 'Team'},
    hours:[{ type: mongoose.Types.ObjectId, ref: 'Hour'}],
    products:[{ type: mongoose.Types.ObjectId, required: true, ref: 'Product'}],
    orders:[{ type: mongoose.Types.ObjectId, required: true, ref: 'Order'}]
    
},{ timestamps: {} });


module.exports = mongoose.model("Store", storeSchema);