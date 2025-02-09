
import mongoose, { Mongoose } from "mongoose";

const PostSchema = new mongoose.Schema({
    questionType: {
        type: String,
        enum: ['text', 'image', 'audio', 'video'],
        required: true
    },

    questionText: {
        type: String,
        minlength: 10,
        maxlength: function () {
            return this.questionType === 'text' ? 360 : 120;
        },
        required: function () {
            return this.questionType === 'text';
        }
    },

    questionMedia: {
        type: [String],  // To handle multiple media files like images, audio, or video
        default: null,
        validate: {
            validator: function (value) {
                if (this.questionType === 'image') {
                    // Validate image files
                    return value.every(file => file.match(/\.(jpeg|jpg|png)$/));
                } else if (this.questionType === 'audio') {
                    // Validate audio files
                    return value.every(file => file.match(/\.(mp3|aac|wav)$/));
                } else if (this.questionType === 'video') {
                    // Validate video files
                    return value.every(file => file.match(/\.mp4$/));
                }
                return true;
            },
            message: 'Invalid file format for media.'
        }
    },

    options: {
        A: {
            text: {
                type: String,
                required: true,
                minlength: 1,
                maxlength: 25,
                validate: {
                    validator: function (v) {
                        return v.trim().length > 0;
                    },
                    message: 'Option must contain at least one non-whitespace character'
                }
            }
        },
        B: {
            text: {
                type: String,
                required: true,
                minlength: 1,
                maxlength: 25,
                validate: {
                    validator: function (v) {
                        return v.trim().length > 0;
                    },
                    message: 'Option must contain at least one non-whitespace character'
                }
            }
        },
        C: {
            text: {
                type: String,
                minlength: 1,
                maxlength: 25,
                validate: {
                    validator: function (v) {
                        return !v || v.trim().length > 0;
                    },
                    message: 'Option must contain at least one non-whitespace character'
                }
            }
        },
        D: {
            text: {
                type: String,
                minlength: 1,
                maxlength: 25,
                validate: {
                    validator: function (v) {
                        return !v || v.trim().length > 0;
                    },
                    message: 'Option must contain at least one non-whitespace character'
                }
            }
        }
    },
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
    location: {
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number],
          default: [0, 0],
        },
        selectLocation: String,
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

export default mongoose.model("Post", PostSchema);