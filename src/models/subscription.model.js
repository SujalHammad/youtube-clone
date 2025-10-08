import mongoose from "mongoose";
const subscriptionSchma=new mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    channel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }
},{timestamps:true})

const Subscription=mongoose.model("Subcription",subscriptionSchma)
export {Subscription}