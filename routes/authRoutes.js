import express from "express";
import { authController } from "../controller/index.js";
import validateUser from "../middleware/validateUser.js";

const router = express.Router();
router.post("/register" ,authController.CreateUser);
router.post("/editprofile",validateUser,authController.editProfile);
router.delete("/deleteuser",validateUser,authController.deleteUser);
router.get("/getProfile",validateUser,authController.getProfile);
router.post('/change-username',validateUser ,authController.changeUsername);

export default router;