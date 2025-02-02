// Copyright (C) 2025 TeraVote All rights reserved.

import mongoose from "mongoose";
import jwt from '../helper/jwtService.js';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        // match: /^[a-z0-9_\.]+$/,
    },
    profilePicture: {
        type: String,
        required: false
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: false
    },
    Gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female', 'Others']
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    emailAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        sparse: true,
    },
    phone: {
        type: String,
        required: false
    },
    isPhoneNumberVerified: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
    },
    tokens: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    Walk_of_life: {
        type: String,
        required: true,
        enum: ['Student', 'Private Employee', 'Government', 'Self-Employed', 'Others'],
    },
    Interest: {
        type: [String],
        required: true,
        enum: ['Business', 'Current Affairs', 'India', 'World', 'Technology', 'Science', 'Health', 'Movies', 'Biography']
    },
    Biography: {
        type: String,
        required: false,
        minlength: 20,
        maxlength: 320
    },
    followingCount: {
        type: Number,
        default: 0,
        required: false
    },
    followersCount: {
        type: Number,
        default: 0,
        required: false
    },
    Post: {
        type: Number,
        default: 0,
        required: false
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
});

// Token generation method
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const payload = {
        userId: user._id,
        email: user.email
    };

    const token = jwt.sign(payload);
    this.tokens = token;
    await this.save();
    return token;
};

// Token removal method
userSchema.methods.removeToken = async function (tokenToRemove) {
    this.tokens = this.tokens.filter(token => token.token !== tokenToRemove);
    await this.save();
};

// Remove all tokens method
userSchema.methods.removeAllTokens = async function () {
    this.tokens = [];
    await this.save();
};

// Token validation method
userSchema.methods.hasValidToken = function (tokenToCheck) {
    return this.tokens.some(token => token.token === tokenToCheck);
};



export default mongoose.model("User", userSchema);