import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";


export const signup = async (req, res, next) => {
    try {
        const { email } = req.body;
        req.body.email = email.toLowerCase();

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        await User.create(req.body);
        res.status(201).send("Signup successful!");
    } catch (err) {
        next(err);
    }
};

export const signin = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { name: req.body.name },
        });
        if (!user) return next(createError(400, "User not found!"));

        const isCorrect = await bcrypt.compare(
            req.body.password, user.password
        );
        if (!isCorrect) return next(createError(400, "Wrong Credentials!"));

        const token = jwt.sign(
            { 
                id: user.id,
                name: user.name,
            },
            process.env.JWT
        );
        // "g234WEtt5"

        const { password, ...others } = user.toJSON();
        res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200).json(others);
        // .json({ details: { ...otherDetails }, role });
    } catch (err) {
        next(err);
    }
};

export const googleAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {email: req.body.email}
        });
        if (user) {
            const token = jwt.sign(
                { id: user.id, }, process.env.JWT
            );
            // const { others } = user.toJSON();
            res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200).json(user);
        } else{
            const savedUser = await User.create({
                ...req.body,
                fromGoogle: true,
            });
            const token = jwt.sign(
                { id: savedUser.id, }, process.env.JWT
            );
            // const { others } = savedUser.toJSON();
            res
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .status(200).json(savedUser);
        }
    } catch (err) {
        next(err);
    }
};