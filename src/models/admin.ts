    import db from "../config/db";
import bcrypt from "bcryptjs";

export interface Admin {
    admin_id: number;
    name:  string;
    username: string;
    password:  string;
    contact_info: number;
}

class AdminModel {
    static async addAdmin(admin: Admin) {
        try {
            admin.password = await bcrypt.hash(admin.password, 10);
            await db.query(
                "INSERT INTO admins (name, username, password, contact_info) VALUES ($1, $2, $3, $4)",
                [admin.name, admin.username, admin.password, admin.contact_info]
            );
        } catch (error) {
            console.error("Error adding admin:", error);
            throw new Error("Could not add admin.");
        }
    }

    static async getAdmin(username:  string): Promise<Admin> {
        try{
            const result = await db.query("SELECT * from  admins where username = $1", [username]);
            return result.rows.length ?  result.rows[0] : null;
        } catch (error){
            console.error("Error getting admin:", error);
            throw new Error("Could not get admin.");
        }
    }
}

export default AdminModel;
