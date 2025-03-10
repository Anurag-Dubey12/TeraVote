import express from "express";
import { postController } from "../controller/index.js";
import validateUser from "../middleware/validateUser.js";

const router = express.Router();
router.post("/createPost", validateUser, postController.createPost);
router.post("/deletePost/:id", validateUser, postController.deletePost);
router.get("/getPost/:id", validateUser, postController.getPost);
router.get("/getUserPost/:id", validateUser, postController.getUserPost);
router.post("/getIntrestBasedQuestion", validateUser, postController.getIntrestBasedQuestion);
router.post("/getMyIntrestBasedQuestion", validateUser, postController.getMyIntrestBasedQuestion);
router.get("/getFollowingPost", validateUser, postController.getFollowingPost);
export default router;