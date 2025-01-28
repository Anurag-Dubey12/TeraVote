// Copyright (C) 2025 TeraVote All rights reserved.

import Joi from "joi";
import { User } from "../models/index.js";
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
                message: "Please Provide userTounFollow"
            });
        }
        try {
           const { userId } = req.params;
            
            const userTounFollow = await User.findOne({
                _id: userId,
                isDeleted: false
            });


            if (!userTounFollow) {
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
    
}
export default userFollowHandler;