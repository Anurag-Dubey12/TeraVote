// Copyright (C) 2025 TeraVote All rights reserved.

import Joi from "joi";
import { User, Connection } from "../models/index.js";
import { FollowService } from "../services/index.js";
import CustomErrorHandler from "../helper/CustomErrorHandler.js";


const userFollowHandler = {

    async followUser(req, res, next) {
        const followSchema = Joi.object({
            userId: Joi.string().required()
        });

        const { error } = followSchema.validate(req.params);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Please Provide userToFollow"
            });
        }

        try {
            const { userId } = req.params;

            const userToFollow = await User.findOne({
                _id: userId,
                isDeleted: false
            });

            if (!userToFollow) {
                return next(CustomErrorHandler.notFound("User not found"));
            }

            const result = await FollowService.followUser(userId);

            return res.status(201).json({
                success: true,
                message: "Successfully followed user",
                data: result
            });
        } catch (err) {
            return next(err);
        }
    },

    async unfollowUser(req, res, next) {
        const followSchema = Joi.object({
            userId: Joi.string().required()
        });

        const { error } = followSchema.validate(req.params);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Please Provide Id of the user to unfollow"
            });
        }

        try {
            const { userId } = req.params;

            const userToUnfollow = await User.findOne({
                _id: userId,
                isDeleted: false
            });

            if (!userToUnfollow) {
                return next(CustomErrorHandler.notFound("User not found"));
            }

            const result = await FollowService.unfollowUser(userId);

            return res.status(201).json({
                success: true,
                message: "Successfully unfollowed user",
                data: result
            });
        } catch (err) {
            return next(err);
        }
    },

    async getConnection(req, res, next) {
        const userid = req.params.userId;
        const type = req.params.type;
        console.log("User Id", userid);
        try {

            const result = await FollowService.getConnection(userid,type);
            return res.status(201).json({
                success: true,
                message: "Successfully Retrieved Connection",
                data: result
            });

        } catch (err) {
            return next(err);
        }
    },

    async removeConnection(req, res, next) {
        const userid = req.params.userId;
        const type = req.params.type;
        try {

            const result = await FollowService.removeConnection(userid,type);
            return res.status(201).json({
                success: true,
                message: "Successfully Removed Connection",
                data: result
            });

        } catch (err) {
            return next(err);
        }
    },
    
}

export default userFollowHandler;