// Copyright (C) 2025 TeraVote All rights reserved.

import { User } from "../models/index.js";
import encrypt from '../middleware/encryption.js';
import CustomErrorHandler from '../helper/CustomErrorHandler.js';
import user from "../models/user.js";
const AuthService = {
    async CreateUser(data) {
        try {
            const {
                username, profilePicture, firstName,
                lastName, Gender,
                dateOfBirth, emailAddress, phone,
                password, country, state,
                city, Walk_of_life, Interest,
                Biography, followersCount, followingCount, Post,
            } = data;

            const encryptedPassword = await encrypt.hashPassword(password);

            const isusernameexist = await user.findOne({
                username: username
            });
            if (isusernameexist) {
                return CustomErrorHandler.alreadyExist("Username already exist");
            }
            const userDetails = new User({
                username,profilePicture,firstName,
                lastName,Gender,dateOfBirth,
                emailAddress,phone,password: encryptedPassword,
                country,state,city,
                Walk_of_life,Interest,Biography,
                followersCount,followingCount,Post,
                isDeleted: false,isPhoneNumberVerified: false
            });

            const savedUser = await userDetails.save();
            const accessToken = await savedUser.generateAuthToken();

            const userData = savedUser.toObject();
            delete userData.password;
            delete userData.__v;

            return {
                user: userData,
            };

        } catch (error) {
            console.error("Error in AuthService.CreateUser:", error);
            return {
                success: false,
                message: error.message || "Failed to create user"
            };
        }
    },

    async editProfile(data) {
        const userId = global.user._id;
        console.log(`User Id:${userId}`);

        try {
            const user = await User.findByIdAndUpdate(
                userId,
                { $set: data },
                { new: true }
            );
            if (!user) {
                return null;
            }
            return user;
        } catch (error) {
            console.error("Error in AuthService.editProfile:", error);

        }
    },
    async deleteUser() {
        const userId = global.user._id;
        console.log(`User Id:${userId}`);
        try {

            const user = await User.findById(userId);
            if (!user) {
                return null;
            }
            user.isDeleted = true;
            user.save();
            return user;
        } catch (error) {
            console.error("Error in AuthService.deleteUser:", error);
        }
    },

    async getProfile() {
        const userId = global.user._id;
        console.log(`User Id:${userId}`);
        const user = await User.findById(userId);
        // if(user.isDeleted){
        //     return CustomErrorHandler.unAuthorized("User not found");
        // }
        // return user;
    },

    async changeUsername(userId, newUsername) {
        try {
            // Ensure that the username is unique
            const existingUser = await User.findOne({ username: newUsername });
            if (existingUser) {
                return {
                    success: false,
                    message: 'Username is already taken.',
                };
            }

            // Update the username
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { username: newUsername },
                { new: true } // Return the updated document
            );

            if (!updatedUser) {
                return {
                    success: false,
                    message: 'User not found.',
                };
            }

            return {
                success: true,
                message: 'Username updated successfully.',
                data: updatedUser,
            };
        } catch (error) {
            console.error('Error in AuthService.changeUsername:', error);
            return {
                success: false,
                message: 'Internal server error.',
            };
        }
    }
};

export default AuthService;