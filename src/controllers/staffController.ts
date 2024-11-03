import { Request, Response } from "express";
import StaffModel, { Staff } from "../models/staff";

export const getStaff = async (req: Request, res: Response) => {
    try {
        const page=parseInt(req.query.page as string)||1;
        const limit=parseInt(req.query.limit as string)||50;
        const staff = await StaffModel.getStaff(page,limit);
        res.status(200).json(staff);
    } catch (error) {
        console.error("Error retrieving staff:", error);
        res.status(500).json({ message: "Error retrieving staff." });
    }
};

export const addStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const { first_name, last_name, badge_number, rank, department, contact_info, role } = req.body;

        const missingFields: string[] = [];

        if (!first_name) missingFields.push("first_name");
        if (!last_name) missingFields.push("last_name");
        if (!badge_number && badge_number !== 0) missingFields.push("badge_number"); // Check for undefined or null
        if (!rank && rank !== 0) missingFields.push("rank"); // Check for undefined or null
        if (!department) missingFields.push("department");
        if (!contact_info) missingFields.push("contact_info");
        if (!role) missingFields.push("role");

        if (missingFields.length > 0) {
            res.status(400).json({ message: `Missing required fields: ${missingFields.join(", ")}` });
            return;
        }

        const newStaff: Staff = {
            staff_id: 0,
            first_name,
            last_name,
            role,
            badge_number,
            rank,
            department,
            contact_info
        };

        await StaffModel.addStaff(newStaff);
        res.status(201).json({ message: "Staff added successfully." });
    } catch (error) {
        console.error("Error adding staff:", error);
        res.status(500).json({ message: "Error adding staff." });
    }
};

export const getStaffById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);
        const staff = await StaffModel.getStaffById(id);

        if (!staff) {
            res.status(404).json({ message: "Staff not found." });
            return;
        }

        res.status(200).json(staff);
    } catch (error) {
        console.error("Error fetching staff by ID:", error);
        res.status(500).json({ message: "Error fetching staff by ID." });
    }
};

export const updateStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid staff ID." });
            return;
        }

        const { first_name, last_name, badge_number, rank, department, contact_info, role } = req.body;

        const updatedFields: Partial<Staff> = {};

        if (first_name !== undefined) updatedFields.first_name = first_name;
        if (last_name !== undefined) updatedFields.last_name = last_name;
        if (badge_number !== undefined) updatedFields.badge_number = badge_number;
        if (rank !== undefined) updatedFields.rank = rank;
        if (department !== undefined) updatedFields.department = department;
        if (contact_info !== undefined) updatedFields.contact_info = contact_info;
        if (role !== undefined) updatedFields.role = role;

        if (Object.keys(updatedFields).length === 0) {
            res.status(400).json({ message: "At least one field must be provided for update." });
            return;
        }

        const existingStaff = await StaffModel.getStaffById(id);

        if (!existingStaff) {
            res.status(404).json({ message: "Staff not found." });
            return;
        }

        const finalUpdateData: Staff = {
            ...existingStaff,
            ...updatedFields,
            // Ensure to keep the original ID intact
            staff_id: existingStaff.staff_id
        };

        await StaffModel.updateStaff(id, finalUpdateData);
        res.status(200).json({ message: "Staff updated successfully." });
    } catch (error) {
        console.error("Error updating staff:", error);
        res.status(500).json({ message: "Error updating staff." });
    }
};

export const deleteStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = parseInt(req.params.id);

        await StaffModel.deleteStaff(id);

        res.status(200).json({ message: "Staff deleted successfully." });
    } catch (error) {
        console.error("Error deleting staff:", error);
        res.status(500).json({ message: "Error deleting staff." });
    }
};

export const getStaffByRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { role } = req.params;
        const page=parseInt(req.query.page as string)||1;
        const limit =parseInt(req.query.limit as string)|| 50;
        const staffMembers = await StaffModel.getStaffByRole(role,page, limit);

        if (staffMembers.length === 0) {
            res.status(404).json({ message: "No staff found with that role." });
        }

        res.status(200).json(staffMembers);
    } catch (error) {
        console.error("Error fetching staff by role:", error);
        res.status(500).json({ message: "Error fetching staff by role." });
    }
};

export const getDistinctRoles = async (req: Request, res: Response): Promise<void> => {
    try {
        const distinctRoles = await StaffModel.getRoles();

        if (!distinctRoles || distinctRoles.length === 0) {
            res.status(404).json({ message: "No roles found with the staff" });
        }

        res.status(200).json(distinctRoles);
    } catch (error) {
        console.error("Error fetching distinct roles", error);
        res.status(500).json({ message: "Error fetching distinct roles" });
    }
};