// Copyright (C) 2025 TeraVote All rights reserved.

import { User, Connection } from "../models/index.js";
import CustomErrorHandler from '../helper/CustomErrorHandler.js';


const FollowService = {
    async followUser(followeeId) {
        const userId = global.user._id;
        console.log("Follower id", userId);

        try {
            // Find the follower and user to follow
            const [follower, userToFollow] = await Promise.all([
                User.findById(userId),
                User.findById(followeeId)
            ]);
            // Check if the users exist
            if (!follower || !userToFollow) {
                throw new Error('User not found');
            }
            // Check if the user is trying to follow themselves
            if (follower._id.toString() === userToFollow._id.toString()) {
                throw new Error('Users cannot follow themselves');
            }

            // Check if the connection already exists 
            const existingConnection = await Connection.findOne({
                follower: userToFollow._id,
                followedUser: follower._id
            });
            // If the connection exists, update the isfollowback field
            if (existingConnection != null) {
                console.log("Found exsiting connection");
                existingConnection.isfollowback = true;
            }
            // Save the connection
            if (existingConnection) {
                await existingConnection.save();
            }

            /***    
             * username: it the name of the user to follow
             * userProfile: it is the profile picture of the user to follow
             * Followerid: it is the id of the user who is following
             * usertofollow: it is the id of the user to follow
             */
            const connectionSchema = new Connection({
                username: userToFollow.username,
                userProfile: userToFollow.profilePicture,
                followedUser: userToFollow._id,
                follower: follower._id,
                isfollowback: existingConnection ? true : false,
                isBlocked: false
            });
            // Save the connection
            await connectionSchema.save();
            //update the follow counts on the User model
            follower.followingCount = follower.followingCount + 1 || 1;
            userToFollow.followersCount = userToFollow.followersCount + 1 || 1;

            await Promise.all([follower.save(), userToFollow.save()]);

            return userToFollow.firstName;
        } catch (err) {
            console.log("Error in following user", err);
            throw err;
        }
    },

    async unfollowUser(followeeId) {
        const userId = global.user._id;
        console.log("Follower id", userId);

        try {
            // Find the follower and user to unfollow
            const [follower, userToUnfollow] = await Promise.all([
                User.findById(userId),
                User.findById(followeeId)
            ]);
            // Check if the users exist
            if (!follower || !userToUnfollow) {
                throw new Error('User not found');
            }
            // Check if the user is trying to unfollow themselves
            if (follower._id.toString() === userToUnfollow._id.toString()) {
                throw new Error('Users cannot unfollow themselves');
            }

            // Find and remove the connection
            const connection = await Connection.findOneAndDelete({
                follower: follower._id,
                followedUser: userToUnfollow._id
            });
            // If the connection does not exist, throw an error
            if (!connection) {
                throw new Error('No such follow connection found');
            }
            // Check if the connection exists
            const existingConnection = await Connection.findOne({
                follower: userToUnfollow._id,
                followedUser: follower._id
            });
            // If the connection exists, update the isfollowback field
            if (existingConnection != null) {
                existingConnection.isfollowback = false;
            }
            if (existingConnection) {
                await existingConnection.save();
            }
            // Optionally update follow counts on User model
            follower.followingCount = follower.followingCount - 1 || 0;
            userToUnfollow.followersCount = userToUnfollow.followersCount - 1 || 0;

            await Promise.all([follower.save(), userToUnfollow.save()]);

            return userToUnfollow.firstName;
        } catch (err) {
            console.log("Error in unfollowing user", err);
            throw err;
        }
    },

    async getConnection(userid, type) {
        try {
            if (type == 'following') {
                console.log("User Id", userid);
                const user_followers = await Connection.find({
                    follower:userid,
                    isBlocked: false
                });
                console.log(`The document id:${user_followers._id}`);
                return user_followers;
            }
            if (type == 'followers') {
                console.log("User Id", userid);
                const user_followers = await Connection.find({
                    followedUser: userid,
                    isBlocked: false
                });
                console.log(`The document id:${user_followers._id}`);
                return user_followers;
            }

        } catch (err) {
            console.log("Error in getting followers", err);
            throw err;
        }
    },

    async removeConnection(userid, type) {
        try {
            if (type === 'following') {
                const connectionToRemove = await Connection.findOne({
                    follower: userid,
                    isBlocked: false
                });

                if (!connectionToRemove) {
                    throw new Error('Connection not found');
                }

                const reverseConnection = await Connection.findOne({
                    follower: connectionToRemove.followedUser,
                    followedUser: userid
                });

                if (reverseConnection) {
                    reverseConnection.isfollowback = false;
                    await reverseConnection.save();
                }
                const [follower, followedUser] = await Promise.all([
                    User.findById(userid),
                    User.findById(connectionToRemove.followedUser)
                ]);

                if (follower) {
                    follower.followingCount = Math.max(0, follower.followingCount - 1);
                    await follower.save();
                }

                if (followedUser) {
                    followedUser.followersCount = Math.max(0, followedUser.followersCount - 1);
                    await followedUser.save();
                }
                await Connection.findByIdAndDelete(connectionToRemove._id);
                return connectionToRemove;
            }

            if (type === 'followers') {
                const connectionToRemove = await Connection.findOne({
                    followedUser: userid,
                    isBlocked: false
                });

                if (!connectionToRemove) {
                    throw new Error('Connection not found');
                }
                const reverseConnection = await Connection.findOne({
                    follower: userid,
                    followedUser: connectionToRemove.follower
                });

                if (reverseConnection) {
                    reverseConnection.isfollowback = false;
                    await reverseConnection.save();
                }
                const [follower, followedUser] = await Promise.all([
                    User.findById(connectionToRemove.follower),
                    User.findById(userid)
                ]);

                if (follower) {
                    follower.followingCount = Math.max(0, follower.followingCount - 1);
                    await follower.save();
                }

                if (followedUser) {
                    followedUser.followersCount = Math.max(0, followedUser.followersCount - 1);
                    await followedUser.save();
                }
                await Connection.findByIdAndDelete(connectionToRemove._id);
                return connectionToRemove;
            }

            throw new Error('Invalid connection type');

        } catch (err) {
            console.log("Error in removing connection", err);
            throw err;
        }
    }
};

export default FollowService;