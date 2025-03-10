
import Joi from "joi";
import { Post } from "../models/index.js"
import { postService } from "../services/index.js";
const postController = {


    //#region create Post
    async createPost(req, res, next) {

        const post_schema = Joi.object({
            questionType: Joi.string().required(),
            questionText: Joi.string().optional(),
            options: Joi.array().min(2).max(4).required(),
            category: Joi.string().required(),
            visibility: Joi.string().optional(),
            questionMedia: Joi.string().optional(),
            longitude: Joi.number().required(),
            latitude: Joi.number().required(),
        });

        const { error } = post_schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        try {
            const result = await postService.createPost(req.body);
            return res.status(201).json({
                success: true,
                message: "Post Created Successfully",
                data: result
            });
        } catch (err) {
            console.log("Failed To add post", err);
        }
    },
    //#endregion

    async deletePost(req, res, next) {
        try {
            const result = await postService.deletePost(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Post Deleted Successfully",
                data: result
            });
        } catch (err) {
            console.log("Failed To delete post", err);
        }
    },

    async getPost(req, res, next) {
        try {
            const result = await postService.getPost(req.params.id);
            return res.status(200).json({
                success: true,
                message: "Post fetched Successfully",
                data: result
            });
        } catch (err) {
            console.log("Failed To fetch post", err);
        }
    },

    async getUserPost(req,res,next){
        try {
            const result = await postService.getUserPost(req.params.id);
            return res.status(200).json({
                success: true,
                message: "User Post fetched Successfully",
                data: result
            });
        } catch (err) {
            console.log("Failed To fetch user post", err);
        }
    },

    async getIntrestBasedQuestion(req, res, next) {
        try {

            if (!req.body || !Array.isArray(req.body) || req.body.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide an array of interest categories"
                });
            }
    
            const result = await postService.getIntrestBasedQuestion(req.body);
            
            if (!result.success && result.error) {
                return res.status(500).json(result);
            }
            
            return res.status(200).json({
                success: true,
                message: "Interest-based questions fetched successfully",
                data: result
            });
        } catch (err) {
            console.log("Failed to fetch interest-based questions", err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch interest-based questions",
                error: err.message
            });
        }
    },

    async getMyIntrestBasedQuestion(req, res, next) {
        try {
            
            const result = await postService.getMyIntrestBasedQuestion();
            
            if (!result.success && result.error) {
                return res.status(500).json(result);
            }
            
            return res.status(200).json({
                success: true,
                message: "Interest-based questions fetched successfully",
                data: result
            });
        } catch (err) {
            console.log("Failed to fetch interest-based questions", err);
            return res.status(500).json({
                success: false,
                message: "Failed to fetch interest-based questions",
                error: err.message
            });
        }
    },

    async getForYou(req, res, next) {
        try {
            const result = await postService.getForYou();
            return res.status(200).json({
                success: true,
                message: "For You fetched Successfully",
                data: result
            });
        } catch (err) {
            console.log("Failed To fetch For You", err);
        }
    },

    async getFollowingPost(req,res,next){
        try {
            const result = await postService.getFollowingPost();
            return res.status(200).json({
                success: true,
                message: "Following Post fetched Successfully",
                data: result
            });
        } catch (err) {
            console.log("Failed To fetch Following Post", err);
        }
    }


}
export default postController;