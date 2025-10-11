import jwt  from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
const verifyJWT=async (req,res,next)=>{
   try{
    const token=req.cookie?.accessToken || req.header("Authorization")
    if(!token){
        new ApiError(401,"Unauthorized request")
    }
    const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    const user=await User.findById(decoded?._id).select("-password -refreshToken")
    if(!user){
        throw new ApiError(401,"Invalid access Token")
    }
    req.user=user;
    next();
   }catch(err){
    throw new ApiError(401,err.message || "Invalid access Token")
   }
}

export {verifyJWT}