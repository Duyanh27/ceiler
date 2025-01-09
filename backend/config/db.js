import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        if (process.env.NODE_ENV === "development") {
            console.log("Mongo URI:", process.env.MONGO_URI);
        }

        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};