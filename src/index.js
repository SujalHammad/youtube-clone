import express from "express"
import dotenv from "dotenv"
import cors from "cors"
dotenv.config({
    path:"./.env"
})



import connectionDb from "./db/db.js"
import {userRoute} from "./routes/user.route.js"



const app=express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    Credential:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("/public"))

app.use("/api/v1/user",userRoute)

connectionDb().then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is listening on the port ${process.env.PORT || 800}`)
    })
}).catch((err)=>{
    console.error("connection failed",err.message)
})




