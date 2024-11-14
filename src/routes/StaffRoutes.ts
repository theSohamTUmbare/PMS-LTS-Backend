import express, { Request, Response } from "express";
import * as controller from "../controllers/staffController";
import verifyToken from "../middlewares/authMiddleware";
import "dotenv/config";
const router = express.Router();

router.get("/getall",verifyToken, controller.getStaff);
router.post("/add", verifyToken,controller.addStaff);
router.get("/getbyID/:id",verifyToken, controller.getStaffById);
router.put("/update/:id",verifyToken, controller.updateStaff);
router.delete("/delete/:id",verifyToken, controller.deleteStaff);
router.get("/getbyRole/:role",verifyToken, controller.getStaffByRole);
router.get("/getRoles",verifyToken, controller.getDistinctRoles);
export default router;