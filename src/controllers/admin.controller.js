const { User } = require("../models/user.models.js")
const { ApiError } = require("../utility/ApiError.js")
const { ApiResponse } = require("../utility/ApiResponse.js")
const { asyncHandler } = require("../utility/AsyncHandler.js")

const getAllUser=asyncHandler(async (req,res,next)=>{
    const users=await User.find().select("-password -refreshToken")
    if(!users){
        throw new ApiError(404,"users not found")
    }
    return res.status(200).json(
        new ApiResponse(200,users,"all users fetched successfully")
    )
})

module.exports={getAllUser}