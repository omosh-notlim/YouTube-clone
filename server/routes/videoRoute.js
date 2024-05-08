import express from "express";
import { 
    addVideo, 
    addView, 
    deleteVideo, 
    getByTag, 
    getVideo, 
    random, 
    search, 
    sub, 
    trend, 
    updateVideo
} from "../controller/videoController.js";
import { verifyToken } from "../utils/verifyToken.js";

const videoRouter = express.Router();

videoRouter.post("/", verifyToken, addVideo); //tested

videoRouter.get("/find/:id", getVideo); //tested
videoRouter.get("/trend", trend); //tested
videoRouter.get("/random", random); //tested
videoRouter.get("/sub",verifyToken, sub); //tested
videoRouter.get("/tags", getByTag);  //tested
videoRouter.get("/search", search); //tested

videoRouter.patch("/:id", verifyToken, updateVideo); //tested
videoRouter.patch("/view/:id", addView); //tested

videoRouter.delete("/:id", verifyToken, deleteVideo); //tested


export default videoRouter;