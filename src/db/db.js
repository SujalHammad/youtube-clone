import mongoose from "mongoose"
const connectionDb=async ()=>{
   try {
     const conn=await mongoose.connect(process.env.MONGODB_URI)
     console.log(`Database connection successfull on || host ${conn.connection.host}` )
   } catch (error) {
        console.log("database connection error ",error)
        process.exit(1);
   }
}

export default connectionDb;