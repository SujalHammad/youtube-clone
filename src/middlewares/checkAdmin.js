const { User } = require("../models/user.models")
const { ApiError } = require("../utility/ApiError")
const { asyncHandler } = require("../utility/AsyncHandler")


const isAdmin=asyncHandler(async (req,res,next)=>{
    const user=await User.findById(req.user._id)
    if(!user){
        throw new ApiError(400,"user is not logged in (token is missing)")
    }
    if(user.role!=="admin"){
        throw new ApiError(400,"user is not an admin")
    }
    next()
})
module.exports={isAdmin}