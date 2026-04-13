const express=require('express')
const {registerUser, loginUser, logOut, refreshAccessToken, changePassword, getCurrentUser, updateAccountDetails, updateAvatar, updateCover, channelUserDetails, watchHistory}=require("../controllers/user.controller.js")
const {upload}=require("../middlewares/multer.middleware.js")
const {verifyJwt}=require("../middlewares/auth.middleware.js")

const userRoute=express.Router();

userRoute.post("/register",upload.fields([
    {name:"avatar",maxCount:1},
    {name:"coverImage",maxCount:1}
]),registerUser);


userRoute.post("/login",loginUser)

userRoute.post("/logout",verifyJwt,logOut)


userRoute.post("/refreshToken",refreshAccessToken)

userRoute.post("/change-password",verifyJwt,changePassword)

userRoute.get("/current-user",verifyJwt,getCurrentUser)

userRoute.patch("/update-accounts",verifyJwt,updateAccountDetails)

userRoute.patch("/update-avatar",verifyJwt,upload.single("avatar"),updateAvatar)

userRoute.patch("/update-cover",verifyJwt,upload.single("coverImage"),updateCover)

userRoute.get("/channel/:username",verifyJwt,channelUserDetails)

userRoute.get("/watchHistory",verifyJwt,watchHistory)



module.exports={userRoute}