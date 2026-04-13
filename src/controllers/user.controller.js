const {asyncHandler}=require("../utility/AsyncHandler.js")
const {ApiError}=require("../utility/ApiError.js")
const {User}=require("../models/user.models.js")
const {ApiResponse}=require("../utility/ApiResponse.js")
const {uploadOnCloudinary}=require("../utility/cloudinary.js")
const jwt=require("jsonwebtoken")
const mongoose=require("mongoose")

const generateRefreshAccessToken=async(userId)=>{
    try
    {   
        const user=await User.findById(userId);
        const accessToken=await user.generateAccessToken();
        const refreshToken=await user.generateRefreshToken();

        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    }
    catch(err){
        throw new ApiError(500,"Something went wrong while generating access and refreshToken")
    }
}


const registerUser=asyncHandler(async (req,res)=>{
    
    const {username,email ,password,fullName}=req.body
    if(!username || !email || !password || !fullName){
        throw new ApiError(
            400,
            'all field are required'
        )
    } 
    const existingUser=await User.findOne({$or:[{username},{email}]})
    
    if(existingUser){
        throw new ApiError(
            409,
            "user already exist with username or email"
        )
    }
    const avatarLocalFilePath=req.files?.avatar[0]?.path

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImageLocalPath=req.files.coverImage[0].path
    }

    if(!avatarLocalFilePath){
        throw new ApiError(
            400,
            "avatar file is required"
        )
    }

    const avatar=await uploadOnCloudinary(avatarLocalFilePath);
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    }

    const user=await User.create({
        username:username.toLowerCase(),
        email:email.toLowerCase(),
        password:password,
        fullName:fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || ""
    })

    const createdUser=await User.findById(user._id).select("-password -refreshToken")
    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user")
    }
   
   return res.status(201).json(
    new ApiResponse(
        200,
        createdUser,
        "User created successfully"
    )
   )
   
})



const loginUser=asyncHandler(async (req,res)=>{ 
    const {username ,email,password}=req.body
    if(!username || !email || !password){
        throw new ApiError(400,"Every field is required")
    }

    const existUser=await User.findOne({$or:[{username},{email}]})
    if(!existUser){
        throw new ApiError(404,"user with this email and username not exist")
    }
    
    const checkPassword=await existUser.comparePassword(password)
    if(!checkPassword){
        throw new ApiError(401,"password is wrong")
    }

    const {accessToken,refreshToken}=await generateRefreshAccessToken(existUser._id)

    const loggedInUser=await User.findById(existUser._id).select("-password -refreshToken")
    
    return res.status(200).cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:1000*60*60*24*7
    }).cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:true,
        sameSite:"strict",
        maxAge:1000*60*60*24*7
    }).json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,
                accessToken,
                refreshToken
            },
            "user logged in successfully"
        )
    )
})

const logOut=asyncHandler(async (req,res)=>{
    const user=await User.findByIdAndUpdate(
        req.user._id,{
            $set:{refreshToken:undefined}
        },
        {new:true}
    )

    return res.status(200).clearCookie("accessToken",{
        httpOnly:true,
        secure:true,
    }).clearCookie("refreshToken",{
        httpOnly:true,
        secure:true,
    })
    .json(
        new ApiResponse(
            200,
            {},
            "user logout successfully"
        )
    )
    
})

const refreshAccessToken=asyncHandler(async (req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
    if(!incomingRefreshToken){
        throw new ApiError(400,"Unauthorized request")
    }

    try {
        const decoded=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        const user=await User.findById(decoded?._id)
        console.log(user)
        if(!user){
            throw new ApiError(401,"Invalid refresh Token")
        }
        if(incomingRefreshToken!==user?.refreshToken){
            throw new ApiError(401,"refreshToken is Expired")
        }

        const {accessToken,newRefreshToken}=await generateRefreshAccessToken(user._id);
       

        return res.status(200).cookie("accessToken",accessToken,{
            httpOnly:true,
            secure:true
        })
        .cookie("refreshToken",newRefreshToken,{
            httpOnly:true,
            secure:true
        }).json(
            new ApiResponse(200,
                {accessToken,refreshToken:newRefreshToken},
                "Access Token Refreshed"
            )
        )

    } catch (error) {
        throw new ApiError(401,error?.message || "Invalid refresh Token")
    }
})

const changePassword=asyncHandler(async (req,res)=>{
    const {oldPassword,newPassword,confPassword}=req.body
    if(!oldPassword || !newPassword || !confPassword){
        throw new ApiError(400,"ALL FIELD ARE REQUIRED")
    }

    if(newPassword!==confPassword){
        throw new ApiError(400,"Password not matching")
    }
    
    const user=await User.findById(req.user._id)

    const comparePassword=await user.comparePassword(oldPassword)
    if(!comparePassword){
        throw new ApiError(400,"old password is wrong")
    }

    user.password=newPassword;
    await user.save({validateBeforeSave:false});

    return res.status(200).json(
        new ApiResponse(200,{},"password changed successfully")
    )

})

const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200).json(
        new ApiResponse(200,
            req.user,
            "Current user fetched successfully"
        )
    )
})


const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {email,fullName}=req.body

    if(!fullName || !email){
        throw new ApiError(400,"All fields are required")
    }

    const user=await User.findByIdAndUpdate(req.user?._id,{$set:{email,fullName}},{new:true}).select("-password")

    return res.status(200).json(
        new ApiResponse(200,
            user,
            "Account  details updated successfully"
        )
    )
    
})

const updateAvatar=asyncHandler(async(req,res)=>{
    const avatarLocalFilePath=req.file?.path

    if(!avatarLocalFilePath){
        throw new ApiError(400,"Avatar file is misssing")
    }

    const avatar=await uploadOnCloudinary(avatarLocalFilePath);

    if(!avatar.url){
        throw new ApiError(400,"Error while uploading on avatar")
    }

    const user=await User.findByIdAndUpdate(req.user?._id,{$set:{avatar:avatar.url}},{new:true}).select("-password")

    return res.status(200).json(
        new ApiResponse(
            200,
            user,
            "Avatar image updated successfully"
        )
    )
})

const updateCover=asyncHandler(async (req,res)=>{
    const coverLocalPath=req.file?.path

    if(!coverLocalPath){
        throw new ApiError(400,"cover file is missing")
    }

    const cover=await uploadOnCloudinary(coverLocalPath);
    if(!cover.url){
        throw new ApiError(400,'error on uploading a cover image')
    }

    const user=await User.findByIdAndUpdate(req.user._id,{$set:{coverImage:cover.url}},{new:true}).select("-password")

    return res.status(200).json(
        new ApiResponse(200,
            user,
            "cover image updated successfully"
        )
    )
})


const channelUserDetails=asyncHandler(async (req,res)=>{
    const {username}=req.params
    if(!username){
        throw new ApiError(400,"Username is missing")
    }

    const channel=await User.aggregate([
        {
            $match:{
                username:username
            },
        },
        {    
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"channel",
                as:"subscribers"
            },
        },
        {
            $lookup:{
                from:"subscriptions",
                localField:"_id",
                foreignField:"subscriber",
                as:"subscribedTo"
            },
        },
        {
            $addFields:{
                subscribersCount:{
                    $size:"$subscribers"
                },
                subcribedToCount:{
                    $size:"$subscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if:{$in:[req.user?._id,"$subscribers.subscriber"]},
                        then:true,
                        else:false
                    }
                }
            }
        },
        {
            $project:{
                fullName:1,
                username:1,
                email:1,
                subscribersCount:1,
                subcribedToCount:1,
                isSubscribed:1,
                avatar:1,
                coverImage:1
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(400,"Channel doesnot exist")
    }

    res.status(200).json(
        new ApiResponse(
            200,
            channel[0],
            "User channel fetched successfully"
        )
    )
})

const watchHistory=asyncHandler(async (req,res)=>{
    const user=await User.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",

                            pipeline:[
                                { 
                                    $project:{
                                    username:1,
                                    fullName:1,
                                    avatar:1
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $addFields:{
                            owner:{$first:"$owner"}
                        }
                    }
                ]
            }
        },
    ])
    
    //array empty hai ya nahi
    
    // if(!user.length){
    //     throw new ApiError(400,"user not found")
    // }

    // //: watchHistory empty hai ya nahi

    // if(!user[0]?.watchHistory?.length){
    //      throw new ApiError(400,"watch history not exist")
    // }

    res.status(200).json(
        new ApiResponse(200,user[0].watchHistory,"watch history fetched successfully")
    )
})







module.exports={
    registerUser,
    loginUser,
    logOut,
    refreshAccessToken,
    changePassword,
    getCurrentUser,
    updateAccountDetails,
    updateAvatar,
    updateCover,
    channelUserDetails,
    watchHistory
}

