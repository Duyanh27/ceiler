import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        console.log("Mongo URI:", process.env.MONGO_URI); // Debug log to confirm the value
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
       console.error(`Error: ${error.message}`);
       process.exit(1); // 1 means exit with failers, 0 is success
    };
}