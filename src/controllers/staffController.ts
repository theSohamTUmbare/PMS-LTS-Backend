import { Request, Response } from "express";
import StaffModel, { Staff } from "../models/staff";


export const getStaff = async (req: Request, res: Response) => {
    try {
        const staff = await StaffModel.getStaff();
        res.status(200).json({ data: staff, message: "Staff are retrieved successfully." });
    } catch (error) {
        console.error("Error retrieving staff:", error);
        res.status(500).json({ message: "Error in retrieving staff" });
    }
};

export const addStaff = async (req: Request, res: Response): Promise<void> => {
    try {
        const { first_name, last_name, badge_number, rank, department, contact_info, staff_id } = req.body;
        if (!first_name || !last_name || !badge_number || !rank || !department || !contact_info || !staff_id) {
            res.status(400).json({ message: "All fields are required." });
            return;
        }
        const newStaff: Staff = {
            staff_id,
            first_name,
            last_name,
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

        res.status(200).json({ data: staff });
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

        const { first_name, last_name, badge_number, rank, department, contact_info } = req.body;

        const updatedFields: Partial<Staff> = {};
        if (first_name !== undefined) updatedFields.first_name = first_name;
        if (last_name !== undefined) updatedFields.last_name = last_name;
        if (badge_number !== undefined) updatedFields.badge_number = badge_number;
        if (rank !== undefined) updatedFields.rank = rank;
        if (department !== undefined) updatedFields.department = department;
        if (contact_info !== undefined) updatedFields.contact_info = contact_info;


        if (Object.keys(updatedFields).length === 0) {
            res.status(400).json({ message: "At least one field must be provided for update." });
            return;
        }
        
        const existingStaff = await StaffModel.getStaffById(id);
        if (!existingStaff) {
            res.status(404).json({ message: "Staff not found." });
            return;
        }

        const finalUpdateData: Staff = { //to only update the field that is required
            ...existingStaff,
            ...updatedFields,
            staff_id: existingStaff.staff_id // to retain the original staff id
        };
        const result = await StaffModel.updateStaff(id, finalUpdateData);
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