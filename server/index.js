import express from "express";
import dotenv from "dotenv";
import sequelize from "./dbConnection.js";

import User from  "./models/User.js";
import Video from "./models/Video.js";
import Comment from "./models/Comment.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import cors from "cors";
import videoRouter from "./routes/videoRoute.js";
import commentRouter from "./routes/commentRoute.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/videos", videoRouter);
app.use("/api/comments", commentRouter);

//error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

(async () => {
    try {
        await sequelize.sync({ force:false });
        console.log("Connected to youtube DB");
    } catch (error) {
        console.log("An error occurred while attempting to connect!", error.message);
    }
})();

app.listen(3006, () => {
    console.log("Server running on port 3006...");
});