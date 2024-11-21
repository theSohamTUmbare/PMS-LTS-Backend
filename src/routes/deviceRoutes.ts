import express from "express";
import verifyToken from "../middlewares/authMiddleware";
import * as controller from "../controllers/deviceController";
import "dotenv/config";

const router = express.Router();

router.get("/all", controller.getDevices);
router.post("/add", controller.createDevice);

export default router;