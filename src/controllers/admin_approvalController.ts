import { Request, Response } from 'express';
import StaffApprovalModel, { StaffApproval } from '../models/admin_approval';
import db from "../config/db";

export const submitApproval = async (req: Request, res: Response): Promise<void> => {
    try {
        const { first_name, last_name, role, badge_number, rank, department, contact_info } = req.body;

        const existingStaffResult = await db.query("SELECT staff_id FROM staff WHERE first_name = $1 AND last_name = $2", [first_name, last_name]);
        
        let staff_id: number;

        if (existingStaffResult && existingStaffResult.rowCount && existingStaffResult.rowCount > 0) {
            staff_id = existingStaffResult.rows[0].staff_id;
        } else {
            staff_id = await StaffApprovalModel.insertStaff(first_name, last_name, role || '', badge_number, rank, department, contact_info);
        }

        const existingBadgeResult = await db.query("SELECT badge_number FROM staff_approval WHERE badge_number = $1", [badge_number]);
        
        if (existingBadgeResult && existingBadgeResult.rowCount && existingBadgeResult.rowCount > 0) {
            res.status(400).json({ message: `Badge number ${badge_number} already exists.` });
            return;
        }

        const newApproval: StaffApproval = {
            staff_id,
            first_name,
            last_name,
            role,
            badge_number,
            rank,
            department,
            contact_info,
            approval_status: 'pending',
        };

        const createdApproval = await StaffApprovalModel.submitApproval(newApproval);
        res.status(200).json({ message: 'Approval request submitted successfully', data: createdApproval });
    } catch (error) {
        console.error("Error in submitApproval:", error);
        res.status(500).json({ message: 'Could not submit approval request' });
    }
};

export const getPendingApprovals = async (req: Request, res: Response): Promise<void> => {
    try {
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;
        const pendingApprovals = await StaffApprovalModel.getPendingApprovals(limit, offset);
        res.status(200).json({ message: 'Pending approvals retrieved successfully', data: pendingApprovals });
    } catch (error) {
        console.error("Error in getPendingApprovals:", error);
        res.status(500).json({ message: 'Could not retrieve pending approvals' });
    }
};

export const approveApproval = async (req: Request, res: Response): Promise<void> => {
    try {
        const approvalId = parseInt(req.params.approvalId);
        const approvedBy = req.body.approved_by;
        
        if (!approvalId || !approvedBy) {
            res.status(400).json({ message: 'Approval ID and approved_by fields are required' });
            return;
        }

        const approvedRequest = await StaffApprovalModel.approveApproval(approvalId, approvedBy);
        
        res.status(200).json({ message: 'Approval request approved successfully', data: approvedRequest });
    } catch (error) {
        console.error("Error in approveApproval:", error);
        res.status(500).json({ message: 'Could not approve approval request' });
    }
};

export const rejectApproval = async (req: Request, res: Response): Promise<void> => {
    try {
        const approvalId = parseInt(req.params.approvalId);
        const rejectionReason = req.body.rejection_reason;

        if (!approvalId || !rejectionReason) {
            res.status(400).json({ message: 'Approval ID and rejection reason are required' });
            return;
        }

        const rejectedRequest = await StaffApprovalModel.rejectApproval(approvalId, rejectionReason);
        await StaffApprovalModel.deleteApproval(approvalId);

        if (rejectedRequest.staff_id) {
            await StaffApprovalModel.deleteStaff(rejectedRequest.staff_id);
        }

        res.status(200).json({ message: 'Approval request rejected successfully', data: rejectedRequest });
    } catch (error) {
        console.error("Error in rejectApproval:", error);
        res.status(500).json({ message: 'Could not reject approval request' });
    }
};
