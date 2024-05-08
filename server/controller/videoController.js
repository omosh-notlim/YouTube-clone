import User from "../models/User.js";
import Video from "../models/Video.js";
import { createError } from "../utils/error.js";
import { Sequelize } from "sequelize";
const { Op } = Sequelize;

// Create Video
export const addVideo = async (req, res, next) => {
    // const newVideo = new Video({ userId: req.user.id, ...req.body });
    try {
        const savedVideo = await Video.create({ userId: req.user.id, ...req.body });
        res.status(200).json(savedVideo);
    } catch (err) {
        next(err);
    }
};

// Update video
export const updateVideo = async (req, res, next) => {
    try {
        const video = await Video.findByPk(req.params.id);
        if (!video) return next(createError(404, "Video not found!"));

        // if (req.user.id === video.userId) {
            const updatedVideo = await Video.update(
                req.body,
                {
                    returning: true,
                    where: { id: req.params.id },
                }
            );
            res.status(200).json(updatedVideo[1]); 
        // } else {
        //     return next(createError(403, "You can update only your video!"));
        // }
    } catch (err) {
        next(err);
    }
};

// Delete video
export const deleteVideo = async (req, res, next) => {
    try {
        const video = await Video.findByPk(req.params.id);
        if (!video) return next(createError(404, "Video not found!"));

        const authenticatedUserId = parseInt(req.user.id);
        const userId = parseInt(video.userId);
        if (userId === authenticatedUserId) {
            await Video.destroy({
                where: { id: req.params.id },
            });
            res.status(200).json("The video has been deleted.");
        } else {
            return next(createError(403, "You can delete only your video!"));
        }
    } catch (err) {
        next(err);
    }
};

// Get video
export const getVideo = async (req, res, next) => {
    try {
        const video = await Video.findByPk(req.params.id);
        if (!video) {
            res.status(404).send('Song not found');
        } else {
            res.status(200).json(video);
        }
    } catch (err) {
        next(err);
    }
};

// Add view
export const addView = async (req, res, next) => {
    try {
        await Video.update(
            { views: Sequelize.literal('views + 1') },
            { where: { id: req.params.id } }
        );
        res.status(200).json("The view has been increased.");
    } catch (err) {
        next(err);
    }
};

// Get random videos
export const random = async (req, res, next) => {
    try {
        const videos = await Video.findAll({
            order: Sequelize.literal('RANDOM()'),
            limit: 40,
        });
    
        res.status(200).json(videos);
      } catch (err) {
        next(err);
      }
};

// Trending videos
export const trend = async (req, res, next) => {
    try {
        const videos = await Video.findAll({
          order: [['views', 'DESC']],
        });
    
        res.status(200).json(videos);
      } catch (err) {
        next(err);
      }
};

// My subs 'channels' videos
export const sub = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
    
        // Get my subscribed channels
        const subscribedChannels = user.subscribedUsers;
    
        // Fetch videos for each subscribed channel
        const list = await Promise.all(
          subscribedChannels.map(async (channelId) => {
            return await Video.findAll({ 
                where: { userId: channelId } 
            });
          })
        );
    
        // Flatten the list of videos and sort by createdAt in descending order
        const flattenedList = list.flat().sort((a, b) => b.createdAt - a.createdAt);
    
        res.status(200).json(flattenedList);
      } catch (err) {
        next(err);
      }
};

// Get by tags
export const getByTag = async (req, res, next) => {
    try {
        let tags = [];
        if (req.query.tags) {
            tags = req.query.tags.split(',');
        }
        const videos = await Video.findAll({
            where: {
            tags: {
                [Op.overlap]: tags,
            },
            },
            limit: 20,
        });

        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};

// Search
export const search = async (req, res, next) => {
    try {
        let q = '';
        if (req.query.q) {
            q = req.query.q.toLowerCase();
        }
        const videos = await Video.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${q}%`,
                },
            },
            limit: 40,
        });

        res.status(200).json(videos);
    } catch (err) {
        next(err);
    }
};