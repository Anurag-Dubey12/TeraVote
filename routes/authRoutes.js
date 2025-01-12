import express from "express";
import { authController } from "../controller/index.js";
import validateUser from "../middleware/validateUser.js";

const router = express.Router();
router.post("/register" ,authController.CreateUser);
router.use(validateUser); 
export default router;