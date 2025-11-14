import mongoose from "mongoose";

const connectDB = async() =>{
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log('Mongodb connected')
    } catch (error) {
        console.log('MongoDB connection error ouccered',error)
        process.exit(1)
    }
}