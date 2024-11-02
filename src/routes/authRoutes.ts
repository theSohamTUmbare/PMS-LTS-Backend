import express from "express";
import verifyToken from "../middlewares/authMiddleware";
import * as controller from "../controllers/authController";
import "dotenv/config";

const router = express.Router();

router.post("/register", controller.adminRegister)
router.post("/login", controller.adminLogin);
router.post("/logout", controller.adminLogout);
router.get("/verify-token", verifyToken, controller.checkToken);

export default router;