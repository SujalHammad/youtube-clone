import express from "express"
import { loginUser, registeUser } from "../controllers/user.conteroller.js"
import { upload } from "../middleware/multer.middleware.js"

const userRoute=express.Router()

userRoute.post("/register",upload.fields([
    {name:"avatar",maxCount:1},
    {name:"coverImage",maxCount:1}
]),registeUser)

userRoute.post("/login",loginUser)

export {userRoute}