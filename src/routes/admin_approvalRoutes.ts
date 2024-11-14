import express, { Request, Response } from "express";
import * as controller from "../controllers/admin_approvalController";
import verifyToken from "../middlewares/authMiddleware";
import "dotenv/config";
const router = express.Router();


router.post('/submit', verifyToken,controller.submitApproval);

router.get('/pending', verifyToken,controller.getPendingApprovals);

router.post('/approve/:approvalId',verifyToken, controller.approveApproval);

router.post('/reject/:approvalId', verifyToken,controller.rejectApproval);


export default router;