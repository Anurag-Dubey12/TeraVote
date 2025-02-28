
import Joi  from "joi";
import {Post} from "../models/index.js"
import {postService } from "../services/index.js";
const postController={


    //#region create Post
    async createPost(req,res,next){

        const post_schema=Joi.object({
            questionType:Joi.string().required(),
            questionText:Joi.string().optional(),
            options:Joi.array().min(2).max(4).required(),
            category:Joi.string().required(),
            visibility:Joi.string().optional(),
            questionMedia:Joi.string().optional(),
        });

        const {error}=post_schema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }
        try{
            const post=req.body;
            if (post.questionType === 'image') {
                if (!post.questionMedia || post.questionMedia.length === 0) {
                    return res.status(400).json({ message: 'At least one image must be uploaded for an image question.' });
                }
            }
    
            if (post.questionType === 'audio') {
                if (!post.questionMedia || post.questionMedia.length === 0) {
                    return res.status(400).json({ message: 'At least one audio file must be uploaded for an audio question.' });
                }
            }
    
            if (post.questionType === 'video') {
                if (!post.questionMedia || post.questionMedia.length !== 1) {
                    return res.status(400).json({ message: 'Exactly one video file must be uploaded for a video question.' });
                }
            }
        }catch(err){
            console.log("Failed To add post",err);
        }

    }
    //#endregion
}
export default mongoose.model("postController", postController);