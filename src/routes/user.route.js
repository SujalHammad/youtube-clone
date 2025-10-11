import express from "express"
import { loginUser, logOut, registeUser } from "../controllers/user.conteroller.js"
import { upload } from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const userRoute=express.Router()

userRoute.post("/register",upload.fields([
    {name:"avatar",maxCount:1},
    {name:"coverImage",maxCount:1}
]),registeUser)

userRoute.post("/login",loginUser);
userRoute.post("/logout",verifyJWT,logOut)

export {userRoute}