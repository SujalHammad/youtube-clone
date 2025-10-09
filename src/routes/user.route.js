import express from "express"
import { registeUser } from "../controllers/user.conteroller.js"
import { upload } from "../middleware/multer.middleware.js"

const userRoute=express.Router()

userRoute.post("/register",upload.fields([
    {name:"avatar",maxCount:1},
    {name:"coverImage",maxCount:1}
]),registeUser)

export {userRoute}