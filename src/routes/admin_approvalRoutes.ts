import express, { Request, Response } from "express";
import * as controller from "../controllers/admin_approvalController";
import verifyToken from "../middlewares/authMiddleware";
import "dotenv/config";
const router = express.Router();


router.post('/submit', controller.submitApproval);

router.get('/pending', controller.getPendingApprovals);

router.post('/approve/:approvalId', controller.approveApproval);

router.post('/reject/:approvalId', controller.rejectApproval);


export default router;