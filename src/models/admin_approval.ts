import db from "../config/db";

export interface StaffApproval {
    staff_id?: number; // Make staff_id optional for initial submission
    first_name: string;
    last_name: string;
    role: string;
    badge_number: number;
    rank: number;
    department: string;
    contact_info?: object;
    approval_status?: 'pending' | 'approved' | 'rejected';
    submitted_at?: Date;
    approved_at?: Date;
    approved_by?: number; // Admin id
    rejection_reason?: string;
}

class StaffApprovalModel {

    static insertStaff = async (first_name: string, last_name: string, role: string, badge_number: number, rank: number, department: string, contact_info?: object): Promise<number> => {
        try {
            const result = await db.query(
                `INSERT INTO staff (first_name, last_name, role, badge_number, rank, department, contact_info) 
                VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING staff_id`,
                [first_name, last_name, role, badge_number, rank, department, contact_info || {}]
            );
            return result.rows[0].staff_id;
        } catch (error) {
            console.error("Error inserting staff:", error);
            throw new Error("Could not insert staff.");
        }
    };

    static deleteApproval = async (approvalId: number): Promise<void> => {
        try {
            await db.query(`DELETE FROM staff_approval WHERE approval_id = $1`, [approvalId]);
        } catch (error) {
            console.error("Error deleting approval:", error);
            throw new Error("Could not delete approval.");
        }
    };


    static deleteStaff = async (staff_id: number): Promise<void> => {
        try {
            await db.query(`DELETE FROM staff WHERE staff_id = $1`, [staff_id]);
        } catch (error) {
            console.error("Error deleting staff:", error);
            throw new Error("Could not delete staff.");
        }
    };

    static submitApproval = async (approval: StaffApproval): Promise<StaffApproval> => {
        try {
            const result = await db.query(
                `INSERT INTO staff_approval 
                (staff_id, first_name, last_name, role, badge_number, rank, department, contact_info, approval_status) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
                [
                    approval.staff_id,
                    approval.first_name,
                    approval.last_name,
                    approval.role,
                    approval.badge_number,
                    approval.rank,
                    approval.department,
                    approval.contact_info || {},
                    approval.approval_status || 'pending'
                ]
            );
            return result.rows[0];
        } catch (error) {
            console.error("Error submitting staff approval:", error);
            throw new Error("Could not submit staff approval.");
        }
    };

    static getPendingApprovals = async (limit: number, offset: number): Promise<StaffApproval[]> => {
        try {
            const result = await db.query(
                `SELECT * FROM staff_approval 
                WHERE approval_status = 'pending' 
                ORDER BY submitted_at DESC 
                LIMIT $1 OFFSET $2`,
                [limit, offset]
            );
            return result.rows;
        } catch (error) {
            console.error("Error fetching pending approvals:", error);
            throw new Error("Could not fetch pending approvals.");
        }
    };

    static approveApproval = async (approvalId: number, approvedBy: number): Promise<StaffApproval> => {
        try {
            const result = await db.query(
                `UPDATE staff_approval 
                SET approval_status = 'approved', approved_at = CURRENT_TIMESTAMP, approved_by = $2 
                WHERE approval_id = $1 AND approval_status = 'pending' 
                RETURNING *`,
                [approvalId, approvedBy]
            );
            if (result.rowCount === 0) {
                throw new Error("Approval request not found or already processed.");
            }
            return result.rows[0];
        } catch (error) {
            console.error("Error approving staff request:", error);
            throw new Error("Could not approve staff request.");
        }
    };

    static rejectApproval = async (approvalId: number, rejectionReason: string): Promise<StaffApproval> => {
        try {
            const result = await db.query(
                `UPDATE staff_approval 
                SET approval_status = 'rejected', rejection_reason = $2 
                WHERE approval_id = $1 AND approval_status = 'pending' 
                RETURNING *`,
                [approvalId, rejectionReason]
            );
            if (result.rowCount === 0) {
                throw new Error("Approval request not found or already processed.");
            }
            return result.rows[0];
        } catch (error) {
            console.error("Error rejecting staff request:", error);
            throw new Error("Could not reject staff request.");
        }
    };
}

export default StaffApprovalModel;