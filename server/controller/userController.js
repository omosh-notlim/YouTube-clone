import User from "../models/User.js";
import Video from "../models/Video.js";
import bcrypt from "bcryptjs";
import { createError } from "../utils/error.js";
import { Sequelize } from "sequelize";


// Update a User
export const patchUser = async (req, res, next) => {
    const userId = parseInt(req.params.id);
    const authenticatedUserId = parseInt(req.user.id);

    if (userId === authenticatedUserId) {
        try {
            if (req.body.password) {
                req.body.password = await bcrypt.hash(
                    req.body.password, 10
                );
            }
            const [updatedCount, updatedUser] = await User.update(
                req.body,
                {
                    returning: true,
                    where: { id: req.params.id },
                }
            );

            if (updatedCount === 0) {
                res.status(404).send("User not found!");
            } else {
                res.status(200).json(updatedUser[0]);
            }
        } catch (err) {
            next(err);
        }
    } else {
        return next(createError(403, "You can update only your account!"));
    }
};

// Delete a User
export const deleteUser = async (req, res, next) => {
    const userId = parseInt(req.params.id);
    const authenticatedUserId = parseInt(req.user.id);

    if (userId === authenticatedUserId) {
      try {
        await User.destroy({
            where: { id: req.params.id },
        });
        res.status(200).json("User has been deleted.");
      } catch (err) {
        next(err);
      }
    } else {
      return next(createError(403, "You can delete only your account!"));
    }
};

// Get a user
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json(user);
        }
    } catch (err) {
        next(err);
    }
};

// Get users
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// subscribe
export const subscribe = async (req, res, next) => {
    try {
        await User.update(
            { subscribedUsers: Sequelize.fn(
                'array_append', Sequelize.col('subscribedUsers'), 
                req.params.id
            ) },
            { where: { id: req.user.id } }
        );

        // Increment the subscribers count for the user being subscribed to
        await User.update(
            { subscribers: Sequelize.literal('subscribers + 1') },
            { where: { id: req.params.id } }
        );

        res.status(200).json('Subscription successful.');
    } catch (err) {
        next(err);
    }
};

// unsubscribe
export const unsubscribe = async (req, res, next) => {
    try {
        await User.update(
            { subscribedUsers: Sequelize.fn(
                'array_remove', Sequelize.col('subscribedUsers'), 
                req.params.id
                ) },
            { where: { id: req.user.id } }
        );

        // Decrement the subscribers count for the user being unsubscribed from
        await User.update(
            { subscribers: Sequelize.literal('subscribers - 1') },
            { where: { id: req.params.id } }
        );

        res.status(200).json('Unsubscription successful.');
    } catch (err) {
        next(err);
    }
};

// like a video
export const like = async (req, res, next) => {
    const userId = req.user.id.toString();
    const videoId = req.params.videoId.toString();
  
    try {
        const video = await Video.findByPk(videoId);

        // Check if the user's id is not already present in the likes array
        if (!video.likes.includes(userId)) {
            await Video.update(
                { likes: Sequelize.fn(
                    'array_append', Sequelize.col('likes'),
                     userId) },
                { where: { id: videoId } }
            );
        }

        // Remove the user's id from the dislikes array
        await Video.update(
            { dislikes: Sequelize.fn('array_remove', Sequelize.col('dislikes'), userId) },
            { where: { id: videoId } }
        );

        res.status(200).json("The video has been liked.");
    } catch (err) {
        next(err);
    }
};

// dislike a video
export const dislike = async (req, res, next) => {
    const userId = req.user.id.toString();;
    const videoId = req.params.videoId.toString();;
  
    try {
        const video = await Video.findByPk(videoId);

        if (!video.dislikes.includes(userId)) {
            await Video.update(
                { dislikes: Sequelize.fn('array_append', Sequelize.col('dislikes'), userId) },
                { where: { id: videoId } }
            );
        }

        // Remove the user id from the likes array
        await Video.update(
            { likes: Sequelize.fn('array_remove', Sequelize.col('likes'), userId) },
            { where: { id: videoId } }
        );

        res.status(200).json("The video has been disliked.");
    } catch (err) {
        next(err);
    }
};