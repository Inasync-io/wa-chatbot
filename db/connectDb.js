import mongoose from "mongoose";

export const connectDB = async () => {
    try {
         const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log(`MongoDB connected: ${conn.connection.host}`);
        // console.log(process.env.MONGO_URL);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};