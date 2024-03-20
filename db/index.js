import mongoose from 'mongoose'
import dotenv from 'dotenv'


dotenv.config({
    path: "./.env"

})

const connectDB=async()=>{
    try{
        const connectionInstance=await mongoose.connect(`${process.env.MONGO_DB_URL}Test`)
        console.log(`Mongo db is connected `);
    }
    catch(error){
        console.log("connection error",error);
        process.exit(1);
    }


}

export {connectDB};