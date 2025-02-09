// Copyright (C) 2025 TeraVote All rights reserved.

import Joi from "joi";
import { User } from "../models/index.js";
import { AuthService } from "../services/index.js";

const authController = {

    //#region create User
    async CreateUser(req, res, next) {

        //Username must be like it must be in lowercase and must contain only letters, numbers, underscores, and periods. /^[a-z0-9_\.]+$/,
        const userSchema = Joi.object({
            username: Joi.string().required().lowercase().min(3).max(30),
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

        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        try {
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
            const result = await AuthService.CreateUser(req.body);
            return res.status(201).json({
                success: true,
                message: "Profile created successfully",
                data: result
            });

        } catch (err) {
            console.log("Error in creating user", err);
        }
    },
    //#endregion


    //#region login
    async login(req, res, next) {
        const { emailAddress, phone, password } = req.body;
    
        // Validate fields
        if (!emailAddress && !phone) {
            return res.status(400).json({ message: "Email Address or Phone is required" });
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }
    
        try {
            const result = await AuthService.login({ emailAddress, phone, password });
            
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: "Login successful",
                    data: result.user,
                    token: result.token
                });
            } else {
                return res.status(400).json({ message: result.message });
            }
        } catch (err) {
            console.log("Error in login", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    //#endregion

    //#region forget password
    async forgotPassword(req, res, next) {
        const { emailAddress, phone } = req.body;
        
        if (!emailAddress && !phone) {
            return res.status(400).json({ message: "Email Address or Phone number is required" });
        }
    
        try {
            const otpResult = await AuthService.generateOTP({ emailAddress, phone });
    
            if (otpResult.success) {
                return res.status(200).json({
                    success: true,
                    message: "OTP sent successfully",
                    otpExpiry: otpResult.expiry
                });
            } else {
                return res.status(400).json({ message: otpResult.message });
            }
        } catch (err) {
            console.log("Error in forgotPassword", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    },

    //#endregion

    
    //#region  Verify OTP and reset password
    async resetPassword(req, res, next) {
        const { otp, newPassword } = req.body;
    
        if (!otp || !newPassword) {
            return res.status(400).json({ message: "OTP and New Password are required" });
        }
    
        try {
            const result = await AuthService.resetPassword(otp, newPassword);
            
            if (result.success) {
                return res.status(200).json({
                    success: true,
                    message: "Password reset successful",
                });
            } else {
                return res.status(400).json({ message: result.message });
            }
        } catch (err) {
            console.log("Error in resetPassword", err);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    //#endregion


    //#region  Edit Profile
    async editProfile(req, res, next) {

        const userSchema = Joi.object({
            username: Joi.string().optional().lowercase().min(3).max(30),
            profilePicture: Joi.string().optional(),
            firstName: Joi.string().optional(),
            lastName: Joi.string().optional(),
            Gender: Joi.string().optional(),
            dateOfBirth: Joi.date().optional().custom((value, helpers) => {
                const ageDiff = Date.now() - value.getTime();
                const ageDate = new Date(ageDiff);
                const age = Math.abs(ageDate.getUTCFullYear() - 1970);
                if (age < 13) {
                    return helpers.error('any.invalid', { message: 'User  must be at least 13 years old.' });
                }
                return value;
            }, 'Age Validation'),
            phone: Joi.string().optional(),
            country: Joi.string().optional(),
            state: Joi.string().optional(),
            city: Joi.string().optional(),
            Walk_of_life: Joi.string().optional(),
            Interest: Joi.array().items(Joi.string()).optional(),
        });

        const { error } = userSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message
            });
        }

        try {
            const result = await AuthService.editProfile(req.body);
            return res.status(201).json({
                success: true,
                message: "Profile edited successfully",
                data: result
            });
        } catch (err) {
            console.log("Error in editing user Controller", err);
        }
    },
    //#endregion

    //#region delete user
    async deleteUser(req, res, next) {
        try {

            const result = await AuthService.deleteUser();
            if (!result) {
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
        } catch (error) {
            console.log("Error in deleting user Controller", error);
        }
    },
    //#endregion

    //#region get user profile
    async getProfile(req, res, next) {
        try {
            const result = await AuthService.getProfile();
            if (!result) {
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
        } catch (error) {
            console.log("Error in getting user Controller", error);
        }
    },

    //#endregion

    //#region change username
    async changeUsername(req, res, next) {
        const usernameSchema = Joi.object({
            username: Joi.string()
                .required()
                .lowercase()
                .pattern(/^[a-z0-9_\.]+$/)
                .min(3)
                .max(30)
                .messages({
                    'string.pattern.base': 'Username must only contain lowercase letters, numbers, underscores, and periods.',
                    'string.min': 'Username must be at least 3 characters long.',
                    'string.max': 'Username cannot exceed 30 characters.',
                }),
        });

        const { error } = usernameSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details[0].message,
            });
        }

        try {
            const userId = global.user._id;
            const { username } = req.body;
            const result = await AuthService.changeUsername(userId, username);

            if (!result.success) {
                return res.status(400).json({
                    success: false,
                    message: result.message,
                });
            }

            return res.status(200).json({
                success: true,
                message: result.message,
                data: result.data,
            });
        } catch (error) {
            console.error('Error in changing username', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error.',
            });
        }
    }
    //#endregion
}

export default authController;