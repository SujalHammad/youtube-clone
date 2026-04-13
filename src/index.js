const express =require("express")
const mongoose=require("mongoose")
const dotenv=require("dotenv")
const cookieParser=require("cookie-parser")
dotenv.config()




const app=express()

app.use(express.json({
    limit:"16kb"
}))

app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(cookieParser())

const { userRoute } = require("./routes/user.route")
// const {adminRoute}=require("./routes/admin.route.js")
const {videoRoute}=require("./routes/video.route.js")

app.use("/api/users",userRoute);
// app.use("/api/admin",adminRoute)
app.use("/api/videos",videoRoute)

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log(`mongodb connection successfully`)
    app.listen(process.env.PORT || 8000,()=>{
        console.log("app is listing on the port",process.env.PORT ||8000)
    } )
}).catch((err)=>{
    console.error(err.message);
    process.exit(1);
})
