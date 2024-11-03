import db from "../config/db";

export interface Staff {
    staff_id: number;
    first_name: string;
    last_name: string;
    role: string;
    badge_number: number;
    rank: number;
    department: string;
    contact_info?: object; // Here they can give phone number, mail id etc. in JSON format for API testing
}

class StaffModel {
    static getStaff = async (): Promise<Staff[]> => {
        try {
            const result = await db.query("SELECT * FROM staff");
            return result.rows;
        } catch (error) {
            console.error("Error fetching staff:", error);
            throw new Error("Could not retrieve staff.");
        }
    }

    static getStaffById = async (id: number): Promise<Staff | null> => {
        try {
            const result = await db.query("SELECT * FROM staff WHERE staff_id = $1", [id]);
            return result.rows.length ? result.rows[0] : null; // Return a single staff member or null
        } catch (error) {
            console.error(`Error fetching staff with ID ${id}:`, error);
            throw new Error("Could not retrieve staff by ID.");
        }
    }

    static getStaffByName = async (first_name: string, last_name?: string): Promise<Staff | null> => {
        try {
            const result = last_name
                ? await db.query("SELECT * FROM staff WHERE first_name = $1 AND last_name = $2", [first_name, last_name])
                : await db.query("SELECT * FROM staff WHERE first_name = $1", [first_name]);
            return result.rows.length ? result.rows[0] : null; // Return a single staff member or null
        } catch (error) {
            console.error(`Error fetching staff with name ${first_name} ${last_name || ''}:`, error);
            throw new Error("Could not retrieve staff by name.");
        }
    }

    static addStaff = async (staff: Staff): Promise<void> => {
        try {
            await db.query(
                "INSERT INTO staff (first_name, last_name, role, badge_number, rank, department, contact_info) VALUES ($1, $2, $3, $4, $5, $6, $7)",
                [staff.first_name, staff.last_name, staff.role, staff.badge_number, staff.rank, staff.department, staff.contact_info]
            );
        } catch (error) {
            console.error("Error adding staff:", error);
            throw new Error("Could not add staff.");
        }
    }

    static updateStaff = async (id: number, staff: Staff): Promise<void> => {
        try {
            await db.query(
                "UPDATE staff SET first_name = $1, last_name = $2, role = $3, badge_number = $4, rank = $5, department = $6, contact_info = $7 WHERE staff_id = $8",
                [staff.first_name, staff.last_name, staff.role, staff.badge_number, staff.rank, staff.department, staff.contact_info, id]
            );
        } catch (error) {
            console.error(`Error updating staff with ID ${id}:`, error);
            throw new Error("Could not update staff.");
        }
    }

    static deleteStaff = async (id: number): Promise<void> => {
        try {
            await db.query("DELETE FROM staff WHERE staff_id = $1", [id]);
        } catch (error) {
            console.error(`Error deleting staff with ID ${id}:`, error);
            throw new Error("Could not delete staff.");
        }
    }

    static getStaffByRole = async (role: string): Promise<Staff[]> => {
        try {
            const result = await db.query("SELECT * FROM staff WHERE role=$1", [role]);
            return result.rows; // Return all matching rows as an array
        } catch (error) {
            console.log(`Error fetching staff with role ${role}:`, error);
            throw new Error("Could not retrieve the staff by role");
        }
    }

    static getRoles = async (): Promise<{ role: string }[]> => {
        try {
            const result = await db.query("SELECT DISTINCT role FROM Staff");
            return result.rows; // Return all distinct roles
        } catch (error) {
            console.log("Error fetching unique roles:", error);
            throw new Error("Could not retrieve the roles");
        }
    }
}

export default StaffModel;