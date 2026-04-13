
const {Video}=require("../models/video.model.js")
const { ApiError } = require("../utility/ApiError.js")
const { ApiResponse } = require("../utility/ApiResponse.js")
const { asyncHandler } = require("../utility/AsyncHandler.js")
const {uploadOnCloudinary}=require("../utility/cloudinary.js")

const uploadVideos=asyncHandler(async(req,res)=>{
    const {title,description,}=req.body
    if(!title || !description){
        throw new ApiError(400,"All fields are required")
    }

    const thumbnailLocalFilePath=req.files?.thumbnail?.[0]?.path
    if(!thumbnailLocalFilePath){
        throw new ApiError(400,"thubnail is required")
    }

    const videoFilePath=req.files?.video?.[0]?.path
    if(!videoFilePath){
        throw new ApiError(400,"video file is required")
    }
    
    const thumbnail=await uploadOnCloudinary(thumbnailLocalFilePath)
    const uploadedVideo=await uploadOnCloudinary(videoFilePath)

    if(!thumbnail || !uploadedVideo){
        throw new ApiError(400,"error while uploading files")
    }
    
    
    const videoDocs=await Video.create({
        title,
        description,
        videoFile:uploadedVideo?.url,
        thumbnail:thumbnail?.url,
        duration:uploadedVideo?.duration || 0,
        owner:req.user?._id
    })

    if(!videoDocs){
        throw new ApiError(500,"something went wrong while creating videoDocs")
    }
    
    return res.status(201).json(
        new ApiResponse(201,
            videoDocs,
            "videoDocs creasted successfully"
        )
    )

})

const  togglePublicStatus=asyncHandler(async(req,res)=>{
    const videoId=req.params.id
    if(!videoId){
        throw new ApiError(400,"videoId is required")
    }
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,"video not found")
    }
    if(req.user._id.toString()!==video.owner.toString()){
        throw new ApiError(403,"you are not allowed to modify video")
    }

    video.isPublished=!video.isPublished
    await video.save({validateBeforeSave:false})

    return res.status(200).json(
        new ApiResponse(200,
            {isPublished:video.isPublished},
            video.isPublished?"video publish successfully":"video unpublish successfully"
        ),
        
    )
})



module.exports={uploadVideos}