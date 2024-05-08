import express from "express";
import { 
    deleteUser,
    dislike,
    getUser,
    getUsers,
    like,
    patchUser, 
    subscribe,
    unsubscribe
} from "../controller/userController.js";
import { 
    verifyToken 
} from "../utils/verifyToken.js";

const userRouter = express.Router();

//get users
userRouter.get("/", getUsers);
//get a user
userRouter.get("/find/:id", getUser);

//delete user
userRouter.delete("/:id", verifyToken, deleteUser);


//update user
userRouter.patch("/:id", verifyToken, patchUser);
//subscribe a user
userRouter.patch("/sub/:id", verifyToken, subscribe);
//unsubscribe a user
userRouter.patch("/unsub/:id", verifyToken, unsubscribe);
//like a video
userRouter.patch("/like/:videoId", verifyToken, like);
//dislike a video
userRouter.patch("/dislike/:videoId", verifyToken, dislike);

export default userRouter;