import { createError } from "../utils/error.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";


export const addComment = async (req, res, next) => {
    try {
        const savedComment = await Comment.create({
            userId: req.user.id, ...req.body 
        });
        res.status(200).send(savedComment);
    } catch (err) {
        next(err);
    }
};

export const deleteComment = async (req, res, next) => {
    try {
        const comment = await Comment.findByPk(req.params.id);
        const video = await Video.findByPk(req.params.id);

        const authenticatedUserId = parseInt(req.user.id);
        const userId = parseInt(comment.userId);
        const vidId = parseInt(video.userId);
        if (
            authenticatedUserId === userId || authenticatedUserId === vidId
        ) {
            await Comment.destroy({
                where: { id: req.params.id },
            });
            res.status(200).json("The comment has been deleted.");
        } else {
            return next(createError(403, "You can only delete your comment!"));
        }
    } catch (err) {
        next(err);
    }
};

export const getComments = async (req, res, next) => {
    try {
        const comments = await Comment.findAll({
            where: { videoId: req.params.videoId },
        });
          res.status(200).json(comments);
    } catch (err) {
      next(err);
    }
  };