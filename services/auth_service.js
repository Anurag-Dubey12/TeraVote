// Copyright (C) 2025 TeraVote All rights reserved.

import { User } from "../models/index.js";
import encrypt from '../middleware/encryption.js';
import CustomErrorHandler from '../helper/CustomErrorHandler.js';
import user from "../models/user.js";

const AuthService = {
    async CreateUser(data) {
        try {
            const {
                profilePicture,
                firstName,
                lastName,
                Gender,
                dateOfBirth,
                emailAddress,
                phone,
                password,
                country,
                state,
                city,
                Walk_of_life,
                Interest,
                Biography,
                followers,
                following
            } = data;

            const encryptedPassword = await encrypt.hashPassword(password);
            
            const userDetails = new User({
                profilePicture,
                firstName,
                lastName,
                Gender,
                dateOfBirth,
                emailAddress,
                phone,
                password: encryptedPassword,
                country,
                state,
                city,
                Walk_of_life,
                Interest,
                Biography,
                followers: followers || [],
                following: following || [],
                isDeleted: false,
                isPhoneNumberVerified: false
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

    async editProfile(data){
        const userId=global.user._id;
        console.log(`User Id:${userId}`);

        try{
            const user = await User.findByIdAndUpdate(
                userId,
                { $set: data },
                { new: true } 
            );
            if (!user) {
                return null;
            }
            return user;
        }catch(error){
            console.error("Error in AuthService.editProfile:", error);

        }
    },
    async deleteUser(){
        const userId=global.user._id;
        console.log(`User Id:${userId}`);
        try{

        const user=await User.findById(userId);
        if(!user){
            return null;
        }
        user.isDeleted=true;
        user.save();
        return user;
    }catch(error){
        console.error("Error in AuthService.deleteUser:", error);
    }
    },

    async getProfile(){
        const userId=global.user._id;
        console.log(`User Id:${userId}`);
        const user=await User.findById(userId);
        // if(user.isDeleted){
        //     return CustomErrorHandler.unAuthorized("User not found");
        // }
        // return user;
    },


};

export default AuthService;