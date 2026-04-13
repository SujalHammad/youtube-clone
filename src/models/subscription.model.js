const mongoose=require("mongoose")

const subscriptionSchema=new mongoose.Schema({
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
},{timestamps:true})

const Subscription=mongoose.model("Subscription",subscriptionSchema)
module.exports={Subscription}