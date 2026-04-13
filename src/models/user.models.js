const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")
const jwt=require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
    },
    password:{
        type:String,
        required:[true,"password is required"],
        minLength:6
    },
    refreshToken:{
        type:String
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"videos"    
        }
    ],
    role:{
        type:String,
        enum:["user","admin"],
        default:"user"
    }
},{timestamps:true})


userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next;

   this.password=await bcrypt.hash(this.password,10)
   next
})

userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=async function (){
    const Token=await jwt.sign({_id:this._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
    return Token;
}

userSchema.methods.generateRefreshToken=async function (){
    const Token=jwt.sign({_id:this._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
    return Token;
}

const User=mongoose.model("User",userSchema);

module.exports={User}
