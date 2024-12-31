// import mongoose from "mongoose";

// export const connectDB = async () => {
//     try {
//         console.log("Mongo URI:", process.env.MONGO_URI); // Debug log to confirm the value
//         const conn = await mongoose.connect(process.env.MONGO_URI);
//         console.log(`MongoDB Connected: ${conn.connection.host}`)
//     } catch (error) {
//        console.error(`Error: ${error.message}`);
//        process.exit(1); // 1 means exit with failers, 0 is success
//     };
// }

import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        if (process.env.NODE_ENV === "development") {
            console.log("Mongo URI:", process.env.MONGO_URI); // Debugging log
        }

        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit with failure
    }
};
