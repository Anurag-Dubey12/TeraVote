
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    questionType: {
        type: String,
        enum: ['text', 'image', 'audio', 'video'],
        required: true
    },

    questionText: {
        type: String,
        minlength: 10,
    },

    questionMedia: {
        type: String, 
        default: ''
    },

    options: [{
        text: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 100,
            validate: {
                validator: function (v) {
                    return v.trim().length > 0;
                },
                message: 'Option must contain at least one non-whitespace character'
            }
        }
    }],    
    category: {
        type: String,
        enum: ['Business', 'Current Affairs', 'India', 'World', 'Technology', 'Science', 'Health', 'Movies'],
        required: true
    },

    visibility: {
        type: String,
        enum: ['public', 'private'],
        required: true
    },

    locationHistory: {
        point: {
          type: {
            type: String,
            enum: ["Point"],
            default: "Point",
            required: false,
          },
          coordinates: {
            type: [Number],
            required: true,
          },
        },
      },
    userid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

PostSchema.index({ "locationHistory.point": "2dsphere" });
export default mongoose.model("Post", PostSchema);