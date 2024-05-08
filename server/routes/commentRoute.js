import express from "express";
import { verifyToken } from "../utils/verifyToken.js";
import { 
    addComment, 
    deleteComment, 
    getComments
} from "../controller/commentController.js";


const commentRouter = express.Router();

commentRouter.post("/", verifyToken, addComment);
commentRouter.get("/:videoId", getComments);
commentRouter.delete("/:id", verifyToken, deleteComment);

export default commentRouter;