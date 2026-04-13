const mongoose=require("mongoose")

const videoSchema=new mongoose.Schema({
    videoFile:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true

    },
    views:{
        type:Number,
        default:0
    },
    isPublished:{
        type:Boolean,
        default:false
    },
    owner:{
        required:true,
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }

},{timestamps:true})

const Video=mongoose.model("Video",videoSchema)
module.exports={Video}