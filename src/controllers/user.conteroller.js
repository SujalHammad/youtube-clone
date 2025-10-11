import {User} from "../models/user.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const generateAccessAndRefreshToke=async (userId)=>{
    const user=User.findById(userId)
    const accessToken=user.generateAccessToken()
    const refreshToken=user.generateRefreshToken()
    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave:false})
    return {accessToken,refreshToken};
}

export const registeUser=asyncHandler(async(req,res)=>{
    const {username,email,password,fullName}=req.body
        if(!username && !email && !password && !fullName){
            throw new ApiError(400,"All fields are required")
        }
        const existUser=await User.findOne({
            $or:[{username},{email}]
        })
        if(existUser){
            throw new ApiError(400,"Username or email already exist")
        }
        
        
        const avatarLocalPath=req.files?.avatar[0]?.path;
       
        
        let coverImageLocalPath;
        if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
            coverImageLocalPath=req.files.coverImage[0].path;
        }

        if(!avatarLocalPath){
            throw new ApiError(400,"Avatar is required")
        }

        const avatar=await uploadOnCloudinary(avatarLocalPath)
        const coverImage=await uploadOnCloudinary(coverImageLocalPath)

        if(!avatar){
            throw new ApiError(400,"Avatar file is required")
        }

        const user=await User.create({
            username:username.toLowerCase(),
            email,
            fullName,
            password,
            avatar:avatar?.url,
            coverImage:coverImage?.url || "",
        })

        const createdUser=await User.findById(user._id).select("-password -refreshToken")

        if(!createdUser){
            throw new ApiError(500,"User not created something went wrong")
        }
        return res.status(201).json(
            new ApiResponse(200,createdUser,"User registered successfully")
        )
    }

)

export const loginUser=asyncHandler(async (req,res)=>{
    const {username,email,password}=req.body;
    if(!username && !email && !password){
        throw new ApiError(400,"all field are required")
    }

    const user=await User.findOne({
        $or:[{email},{username}]
    })
    if(!user){
        throw new ApiError(400,"plz enter correct username and email")
    }

    const isPasswordCorrect=await user.isPasswordCorrect(password)
    if(!isPasswordCorrect){
        throw new ApiError(400,"password is wrong")
    }
    const {accesToken,refreshToken}=generateAccessAndRefreshToke(existUser._id)

   const loggedInUser=User.findById(user._id).select("-password refreshToken")

    res.status(200).cookie("accessToken",accesToken,{
        httpOnly:true,
        secure:true
    }).cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:true
    }).json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,
                accessToken,
                refreshToken
            },
            "User logged in Successfully"


        )
    )
})

export const logOut=asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(req.user._id,{$set:{refreshToken:undefined}},{new:true})
    const options={
        httpOnly:true,
        secure:true
    }

    res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(
        new ApiResponse(
            200,
            {},
            "User logged out successfully"
        )
    )
})