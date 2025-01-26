// Copyright (C) 2025 TeraVote All rights reserved.

import Joi from "joi";
import {User} from "../models/index.js";
import { AuthService } from "../services/index.js";

const authController = {

    //#region create User
    async CreateUser(req,res,next){
        const userSchema = Joi.object({
            profilePicture: Joi.string().optional(), 
            firstName: Joi.string().required(), 
            lastName: Joi.string().optional(), 
            Gender: Joi.string().required(), 
            dateOfBirth: Joi.date().required().custom((value, helpers) => {
                const ageDiff = Date.now() - value.getTime();
                const ageDate = new Date(ageDiff);
                const age = Math.abs(ageDate.getUTCFullYear() - 1970);
                if (age < 13) {
                    return helpers.error('any.invalid', { message: 'User  must be at least 13 years old.' });
                }
                return value;
            }, 'Age Validation'),
            emailAddress: Joi.string().email({ minDomainSegments: 2 }).required(),
            phone: Joi.string().optional(),
            password: Joi.string()
                .min(5)
                .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/)
                .required()
                .messages({
                    'string.pattern.base': 'Password must be alphanumeric and contain no spaces',
                }),
            country: Joi.string().optional(), 
            state: Joi.string().optional(),
            city: Joi.string().optional(),
            Walk_of_life: Joi.string().required(),
            Interest: Joi.array().items(Joi.string()).required(),
            Biography: Joi.string().optional().min(20).max(320),
            followers: Joi.array().items(Joi.string()).default([]),
            following: Joi.array().items(Joi.string()).default([])
        });

        const {error}=userSchema.validate(req.body);
        if(error){
            return res.status(400).json({message:error.message});
        }
        try{
            const { emailAddress } = req.body;
            if (!emailAddress || emailAddress.trim() === '') {
                return res.status(400).json({ message: "Valid emailAddress is required" });
            }
            
            // Check if user already exists
            const isDataExist = await User.findOne({
                emailAddress: emailAddress.toLowerCase(),
                isDeleted: false
            });
            if (isDataExist) {
                return next(
                    new Error("User already exists with this emailAddress Address")
                );
            }
            const result=await AuthService.CreateUser(req.body);
            return res.status(201).json({
                success: true,
                message: "Profile created successfully",
                data: result
            });

        }catch(err){
            console.log("Error in creating user",err);
        }
    },
    //#endregion

    async editProfile(req,res,next){

        const userSchema = Joi.object({
            profilePicture: Joi.string().optional(), 
            firstName: Joi.string().required(), 
            lastName: Joi.string().optional(),
            Gender: Joi.string().required(),
            dateOfBirth: Joi.date().required().custom((value, helpers) => {
                const ageDiff = Date.now() - value.getTime();
                const ageDate = new Date(ageDiff);
                const age = Math.abs(ageDate.getUTCFullYear() - 1970);
                if (age < 13) {
                    return helpers.error('any.invalid', { message: 'User  must be at least 13 years old.' });
                }
                return value;
            }, 'Age Validation'),
            phone: Joi.string().optional(),
            password: Joi.string()
                .min(5)
                .pattern(/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/)
                .required()
                .messages({
                    'string.pattern.base': 'Password must be alphanumeric and contain no spaces',
                }),
                country: Joi.string().optional(), 
                state: Joi.string().optional(),
                city: Joi.string().optional(),
            Walk_of_life: Joi.string().required(),
            Interest: Joi.array().items(Joi.string()).required(),
        
        });

        const {error}=userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        try{
            const result=await AuthService.editProfile(req.body);
            return res.status(201).json({
                success: true,
                message: "Profile edited successfully",
                data: result
            });
        }catch(err){
            console.log("Error in editing user Controller",err);
        }
    },
    async deleteUser(req,res,next){
        try{

            const result=await AuthService.deleteUser();
            if(!result){
                return res.status(400).json({
                    success: false,
                    message: "User not found"
                });
            }
            return res.status(200).json({
                success: true,
                message: "Profile deleted successfully",
                data: { user: result }
            });
        }catch(error){
            console.log("Error in deleting user Controller",error);
        }
    },

    async getProfile(req,res,next){
        try{
            const result =await AuthService.getProfile();
            if(!result){
                return res.status(400).json({
                    success: false,
                    message: "User not found"
                });
            }
            return res.status(200).json({
                success: true,
                message: "Profile found successfully",
                data: { user: result }
            });
        }catch(error){
            console.log("Error in getting user Controller",error);
        }
    },

    async followUser(req,res,next){
        const userId  = req.params.userId;
        console.log(`User id which is to be followed: ${userId}`);
        const userSchema = Joi.object({
            userId: Joi.string().required()
        });

        const {error}=userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        try{
            const result=await AuthService.followUser(req.body);
            if(!result){
                return res.status(400).json({
                    success: false,
                    message: "User not found"
                });
            }
            return res.status(200).json({
                success: true,
                message: "User followed successfully",
                data: { user: result }
            });
        }catch(error){
            console.log("Error in following user Controller",error);
        }
    }

}

export default authController;