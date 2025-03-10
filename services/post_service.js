
import { Post, User, Connection } from "../models/index.js"
import ImageUploader from "../helper/ImageUploader.js"
import CustomErrorHandler from "../helper/CustomErrorHandler.js";
import user from "../models/user.js";
const postService = {
  async createPost(data) {
    const {
      questionType,
      questionText,
      questionMedia,
      options,
      category,
      visibility,
    } = data;

    console.log(`questionType: ${questionType}`);
    const user = global.user;
    // let imageurl = '';
    // if (questionType === "image") {
    //   if (!questionMedia || questionMedia.length === 0) {
    //     return { success: false, message: "At least one image is required" };
    //   }
    //   // if (questionMedia.length > 4) {
    //   //   return { success: false, message: "You can add only 4 images" };
    //   // }

    //   if (questionMedia) {
    //     imageurl = ImageUploader.Upload(questionMedia, "Post")
    //   }
    // } else if (questionType === "audio") {
    //   if (!questionMedia || questionMedia.length === 0) {
    //     return { success: false, message: "At least one audio file is required" };
    //   }
    //   if (questionMedia) {
    //     imageurl = ImageUploader.Upload(questionMedia, "Post")
    //   }
    // } else if (questionType === "video") {
    //   if (!questionMedia || questionMedia.length !== 1) {
    //     return { success: false, message: "Exactly one video file is required" };
    //   }
    //   if (questionMedia) {
    //     imageurl = ImageUploader.Upload(questionMedia, "Post")
    //   }
    // } else {
    //   return { success: false, message: "Invalid question type" };
    // }

    const post = new Post({
      questionType: questionType,
      questionText: questionText,
      questionMedia: "",
      options: options,
      category,
      visibility,
      locationHistory: {
        point: {
          type: "Point",
          coordinates: [parseFloat(data.longitude), parseFloat(data.latitude)],
        },
        selectLocation: data.selectLocation,
      },
      userid: user._id,
    });

    try {
      await post.save();
      return post;
    } catch (error) {
      return { success: false, message: "Error while saving the post", error };
    }

  },

  async deletePost(id) {
    try {
      const post = await Post.findByIdAndDelete(id);
      if (!post) {
        return "Post not found"
      }
      return post;
    } catch (error) {
      return { success: false, message: "Error while deleting the post", error };
    }
  },
  async getPost(id) {
    try {
      const post = await Post.findById(id, { __v: 0, locationHistory: 0 });
      if (!post) {
        return "Post not found"
      }
      return post;
    } catch (error) {
      return { success: false, message: "Error while fetching the post", error };
    }
  },
  async getUserPost(id) {
    try {
      const post = await Post.find({ userid: id }, { __v: 0, locationHistory: 0 });
      if (!post) {
        return "Post not found"
      }
      return post;
    } catch (error) {
      return { success: false, message: "Error while fetching the post", error };
    }
  },


  async getIntrestBasedQuestion(interests) {
    try {

      if (!Array.isArray(interests) || interests.length === 0) {
        return { success: false, message: "Interests must be provided as a non-empty array" };
      }
      const posts = await Post.find(
        {
          category: { $in: interests },
          $or: [
            { visibility: 'public' }
          ]
        },
        { __v: 0, locationHistory: 0 }
      ).sort({ createdAt: -1 });

      if (!posts || posts.length === 0) {
        return { success: true, message: "No posts found matching your interests", data: [] };
      }

      return posts;
    } catch (error) {
      console.error("Error fetching interest-based questions:", error);
      return {
        success: false,
        message: "Error while fetching interest-based posts",
        error: error.message
      };
    }
  },

  async getMyIntrestBasedQuestion() {
    try {

      const userInfo = global.user;

      const user = await User.findById(userInfo._id);
      if (!user) {
        return { success: false, message: "User not found" };
      }
      const posts = await Post.find(
        {
          category: { $in: user.Interest },
          $or: [
            { visibility: 'public' }
          ]
        },
        { __v: 0, locationHistory: 0 }
      ).sort({ createdAt: -1 });

      if (!posts || posts.length === 0) {
        return { success: true, message: "No posts found matching your interests", data: [] };
      }

      return posts;
    } catch (error) {
      console.error("Error fetching interest-based questions:", error);
      return {
        success: false,
        message: "Error while fetching interest-based posts",
        error: error.message
      };
    }
  },


  async getFollowingPost() {
    try {
      const userInfo = global.user;
      const user = await User.findById(userInfo._id);

      if (!user) {
        return { success: false, message: "User not found" };
      }

      const following = await Connection.find({
        follower: user._id,
        isBlocked: false
      });

      const post = await Post.find({
        userid: { $in: following.map(f => f.followedUser) },
      });
      console.log(post);

    } catch (err) {
      console.error("Error fetching interest-based questions:", err);
    }


  },

  async getForYou() {
    try {

      
    } catch (err) {

    }
  }

}
export default postService;