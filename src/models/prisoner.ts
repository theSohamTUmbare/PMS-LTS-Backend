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
    cell_id: number;
    behavior_record?: object;
    medical_history?: object;
    tracking_device_id?: number;
}

class PrisonerModel {
    static getPrisoners = async (): Promise<Prisoner[]> => {
        try {
            const result = await db.query("SELECT * FROM prisoners");
            return result.rows;
        } catch (error) {
            console.error("Error fetching prisoners:", error);
            throw new Error("Could not retrieve prisoners.");
        }
    }

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
            
        } catch(error){
            console.error(`Error fetching prisoner with tracking device ID ${trackingDeviceId}:`, error);
            throw new Error("Could not retrieve prisoner by tracking device id.");
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

    static updatePrisoner = async (id: number, prisoner: Prisoner): Promise<void> => {
        try {
            await db.query(
                "UPDATE prisoners SET first_name = $1, last_name = $2, date_of_birth = $3, gender = $4, national_id = $5, entry_date = $6, status = $7, cell_id = $8 WHERE prisoner_id = $9",
                [prisoner.first_name, prisoner.last_name, prisoner.date_of_birth, prisoner.gender, prisoner.national_id, prisoner.entry_date, prisoner.status, prisoner.cell_id, id]
            );
        } catch (error) {
            console.error(`Error updating prisoner with ID ${id}:`, error);
            throw new Error("Could not update prisoner.");
        }
    }

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
