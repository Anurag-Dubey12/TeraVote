// Copyright (C) 2025 TeraVote All rights reserved.

import { User } from "../models/index.js";
import CustomErrorHandler from '../helper/CustomErrorHandler.js';

const FollowService={
    async followUser(followeeId){
        const userId=global.user._id;
        console.log("Follower id",userId);
        
        try{
            const [follower, userToFollow] = await Promise.all([
                User.findById(userId),
                User.findById(followeeId)
            ]);
            if (!follower || !userToFollow) {
                throw new Error('User not found');
            }
            
            if (follower._id.toString() === userToFollow._id.toString()) {
                throw new Error('Users cannot follow themselves');
            }

            follower.following.push(userToFollow._id);
            userToFollow.followers.push(follower._id);

            await Promise.all([
                follower.save(),
                userToFollow.save()
            ]);
            return userToFollow.firstName;
        }catch(err){
           console.log("Error in following user",err);
           throw err;
        }
    },
    async unfollowUser(followeeId){
        const userId=global.user._id;
        console.log("Follower id",userId);
        
        try{
            const [follower, userTounFollow] = await Promise.all([
                User.findById(userId),
                User.findById(followeeId)
            ]);
            if (!follower || !userTounFollow) {
                throw new Error('User not found');
            }
            
            if (follower._id.toString() === userTounFollow._id.toString()) {
                throw new Error('Users cannot unfollow themselves');
            }

            follower.following.pop(userTounFollow._id);
            userTounFollow.followers.pop(follower._id);

            await Promise.all([
                follower.save(),
                userTounFollow.save()
            ]);
            return userTounFollow.firstName;
        }catch(err){
           console.log("Error in unfollowing user",err);
           throw err;
        }
    },

}
export default FollowService;