import mongoose from "mongoose";
import jwt from '../helper/jwtService.js'

const userSchema =  mongoose.Schema({
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
    dateOfBirth: {
        type: Date,
        required: true,
        // validate: {
        //     validator: function(value) {
        //         const ageDiff = Date.now() - value.getTime();
        //         const ageDate = new Date(ageDiff);
        //         return Math.abs(ageDate.getUTCFullYear() - 1970) > 12;
        //     },
        //     message: 'User must be at least 13 years old.'
        // }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
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
        // match: [/^(?=.*[a-zA-Z])(?=.*[0-9])[A-Za-z0-9]+$/, 'Password must be alphanumeric and contain no spaces']
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
    isDeleted: {
        type: Boolean,
        default: false,
      },
    createdAt: {
        type: Date,
        default: Date.now,
      },
});
userSchema.set("timestamps", true);

userSchema.methods.generateAuthToken = async function() {
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


userSchema.methods.removeToken = async function(tokenToRemove) {
  this.tokens = this.tokens.filter(token => token.token !== tokenToRemove);
  await this.save();
};

// Method to remove all tokens (logout from all devices)
userSchema.methods.removeAllTokens = async function() {
  this.tokens = [];
  await this.save();
};

// Method to find token
userSchema.methods.hasValidToken = function(tokenToCheck) {
  return this.tokens.some(token => token.token === tokenToCheck);
};

export default mongoose.model("User", userSchema);