// Copyright (C) 2025 TeraVote All rights reserved.
import mongoose from "mongoose";

const ConnectionSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    userProfile:{
        type: String,
    },
    followedUser: {  // The user who is being followed
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    follower: {  // The user who is following
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isfollowback: {
        type: Boolean,
        default: false
    },
    followedAt: { 
        type: Date, 
        default: Date.now 
    },
    isBlocked: {
        type: Boolean,
        default: false
    } 
}, {
    timestamps: true
});
export default mongoose.model("Connection", ConnectionSchema);