import express from "express";
import { userFollowHandler } from "../controller/index.js";
import validateUser from "../middleware/validateUser.js";

const router = express.Router();
router.post("/follow/:userId", validateUser,userFollowHandler.followUser);
router.post("/unfollow/:userId", validateUser,userFollowHandler.unfollowUser);
router.get("/getConnection/:type/:userId", validateUser,userFollowHandler.getConnection);
router.post("/removeConnection/:type/:userId", validateUser,userFollowHandler.removeConnection);
export default router;