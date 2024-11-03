import express, { request, Response } from "express";
import * as controller from "../controllers/staffController";
import verifyToken from "../middlewares/authMiddleware";
import "dotenv/config";
const router = express.Router();

router.get("/getall", controller.getStaff);
router.post("/add", controller.addStaff);
router.get("/getbyID/:id", controller.getStaffById);
router.put("/update/:id", controller.updateStaff);
router.delete("/delete/:id", controller.deleteStaff);
router.get("/getbyRole/:role", controller.getStaffByRole);
router.get("/getRoles", controller.getDistinctRoles);
export default router;