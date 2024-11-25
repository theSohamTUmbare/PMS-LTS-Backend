import db from "../config/db";

export interface Prisoner {
    prisoner_id: number;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    gender: string;
    national_id: string;
    entry_date: Date;
    release_date?: Date;
    status: 'Incarcerated' | 'Released' | 'On Trial' | 'Transferred';
    cell_id?: number;
    behavior_record?: object;
    medical_history?: object;
    tracking_device_id?: number;
}

class PrisonerModel {
    static getPrisoners = async (page: number = 1, limit: number = 20): Promise<Prisoner[]> => {
        try {
            const offset = (page - 1) * limit;
            const result = await db.query("SELECT * FROM prisoners LIMIT $1 OFFSET $2", [limit, offset]);
            return result.rows;
        } catch (error) {
            console.error("Error fetching prisoners:", error);
            throw new Error("Could not retrieve prisoners.");
        }
    }

    // Get count of prisoners for pagination
    static getPrisonerCount = async (): Promise<number> => {
        try {
            const result = await db.query("SELECT COUNT(*) FROM prisoners");
            return parseInt(result.rows[0].count, 10);
        } catch (error) {
            console.error("Error counting prisoners:", error);
            throw new Error("Could not retrieve prisoner count.");
        }
    };

    static getPrisonerById = async (id: number): Promise<Prisoner | null> => {
        try {
            const result = await db.query("SELECT * FROM prisoners WHERE prisoner_id = $1", [id]);
            return result.rows.length ? result.rows[0] : null;
        } catch (error) {
            console.error(`Error fetching prisoner with ID ${id}:`, error);
            throw new Error("Could not retrieve prisoner by ID.");
        }
    }

    static getPrisonerByName = async (first_name: string, last_name?: string): Promise<Prisoner | null> => {
        try {
            const result = last_name 
                ? await db.query("SELECT * FROM prisoners WHERE first_name = $1 AND last_name = $2", [first_name, last_name])
                : await db.query("SELECT * FROM prisoners WHERE first_name = $1", [first_name]);
            return result.rows.length ? result.rows[0] : null;
        } catch (error) {
            console.error(`Error fetching prisoner with name ${first_name} ${last_name || ''}:`, error);
            throw new Error("Could not retrieve prisoner by name.");
        }
    }

    static getPrisonerByCellId = async (cellId: number): Promise<Prisoner | null> => {
        try {
            const result = await db.query("SELECT * FROM prisoners WHERE cell_id = $1", [cellId]);
            return result.rows.length ? result.rows[0] : null;
        } catch (error) {
            console.error(`Error fetching prisoner with cell ID ${cellId}:`, error);
            throw new Error("Could not retrieve prisoner by cell ID.");
        }
    }

    static getPrisonerByTrackingDeviceId = async (trackingDeviceId: number): Promise<Prisoner | null> => {
        try {
            const result = await db.query("SELECT * FROM prisoners WHERE tracking_device_id = $1", [trackingDeviceId]);
            return result.rows.length ? result.rows[0] : null;
        } catch(error) {
            console.error(`Error fetching prisoner with tracking device ID ${trackingDeviceId}:`, error);
            throw new Error("Could not retrieve prisoner by tracking device id.");
        }
    }

    // Get prisoners by status
    static getPrisonersByStatus = async (status: Prisoner['status']): Promise<Prisoner[]> => {
        try {
            const result = await db.query("SELECT * FROM prisoners WHERE status = $1", [status]);
            return result.rows;
        } catch (error) {
            console.error(`Error fetching prisoners with status ${status}:`, error);
            throw new Error("Could not retrieve prisoners by status.");
        }
    }

    static addPrisoner = async (prisoner: Prisoner): Promise<void> => {
        try {
            await db.query(
                "INSERT INTO prisoners (first_name, last_name, date_of_birth, gender, national_id, entry_date, status, cell_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
                [prisoner.first_name, prisoner.last_name, prisoner.date_of_birth, prisoner.gender, prisoner.national_id, prisoner.entry_date, prisoner.status, prisoner.cell_id]
            );
        } catch (error) {
            console.error("Error adding prisoner:", error);
            throw new Error("Could not add prisoner.");
        }
    }

    // Advanced search for prisoners by multiple criteria
    static searchPrisoners = async (criteria: Partial<Prisoner>): Promise<Prisoner[]> => {
        const keys = Object.keys(criteria);
        const values = Object.values(criteria);
        
        if (!keys.length) {
            throw new Error("No criteria provided for search.");
        }

        const conditions = keys.map((key, index) => `${key} = $${index + 1}`).join(" AND ");
        const query = `SELECT * FROM prisoners WHERE ${conditions}`;

        try {
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            console.error("Error searching prisoners:", error);
            throw new Error("Could not search prisoners.");
        }
    }

    static updatePrisoner = async (id: number, updates: Partial<Prisoner>): Promise<void> => {
        try {
            await db.query(
                `UPDATE prisoners 
                 SET first_name = COALESCE($1, first_name), 
                     last_name = COALESCE($2, last_name), 
                     date_of_birth = COALESCE($3, date_of_birth), 
                     gender = COALESCE($4, gender), 
                     national_id = COALESCE($5, national_id), 
                     entry_date = COALESCE($6, entry_date), 
                     status = COALESCE($7, status), 
                     cell_id = COALESCE($8, cell_id),
                     tracking_device_id = COALESCE($9, tracking_device_id),
                     behavior_record = COALESCE($10::json, behavior_record), 
                     medical_history = COALESCE($11::json, medical_history) 
                 WHERE prisoner_id = $12`,
                [
                    updates.first_name || null,
                    updates.last_name || null,
                    updates.date_of_birth || null,
                    updates.gender || null,
                    updates.national_id || null,
                    updates.entry_date || null,
                    updates.status || null,
                    updates.cell_id || null,
                    updates.tracking_device_id || null,
                    updates.behavior_record ? JSON.stringify(updates.behavior_record) : null,
                    updates.medical_history ? JSON.stringify(updates.medical_history) : null,
                    id
                ]
            );
        } catch (error) {
            console.error(`Error updating prisoner with ID ${id}:`, error);
            throw new Error("Could not update prisoner.");
        }
    };
    

    static deletePrisoner = async (id: number): Promise<void> => {
        try {
            await db.query("DELETE FROM prisoners WHERE prisoner_id = $1", [id]);
        } catch (error) {
            console.error(`Error deleting prisoner with ID ${id}:`, error);
            throw new Error("Could not delete prisoner.");
        }
    }
}

export default PrisonerModel;
