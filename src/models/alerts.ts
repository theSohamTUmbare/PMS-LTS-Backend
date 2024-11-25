import db from "../config/db";

export interface Alert {
    alert_id: number;
    device_id: string;
    alert_type: string;
    date: Date;
    timestamp: Date;
    details: string;
}

class AlertModel {
    // Fetch all alerts
    static getAlerts = async (): Promise<Alert[]> => {
        try {
            const result = await db.query("SELECT * FROM alerts");
            return result.rows;
        } catch (error) {
            console.error("Error fetching alerts:", error);
            throw new Error("Could not retrieve alerts.");
        }
    };

    // Fetch a specific alert by ID
    static getAlertById = async (alertId: number): Promise<Alert | null> => {
        try {
            const result = await db.query("SELECT * FROM alerts WHERE alert_id = $1", [alertId]);
            if (result.rows.length > 0) {
                return result.rows[0];
            }
            return null;
        } catch (error) {
            console.error("Error fetching alert by ID:", error);
            throw new Error("Could not retrieve the alert.");
        }
    };

    // Add a new alert
    static addAlert = async (alert: Omit<Alert, "alert_id">): Promise<void> => {
        console.log(alert)
        const { device_id, alert_type, date, timestamp, details } = alert;
        // Convert the date to a string in 'YYYY-MM-DD' format
        const formattedDate = new Date(date).toISOString().split('T')[0];  // Extract 'YYYY-MM-DD' part
        // Combine the formatted date and timestamp into a single string: 'YYYY-MM-DD HH:mm:ss'
        const combinedDateString = `${formattedDate} ${timestamp}`;
        // Create a Date object from the combined string
        const localDate = new Date(combinedDateString);
        
        try {
            await db.query(
                `INSERT INTO alerts (device_id, alert_type, date, timestamp, details)
                 VALUES ($1, $2, $3, $4, $5)`,
                [device_id, alert_type, date, localDate, details]
            );
        } catch (error) {
            console.error("Error adding alert:", error);
            throw new Error("Could not add the alert.");
        }
    };

    // Fetch alerts by partial input
    static getAlertsByPartialInput = async (filter: Partial<Omit<Alert, "alert_id">>): Promise<Alert[]> => {
        const { device_id, alert_type, date, details } = filter;
        const conditions: string[] = [];
        const values: any[] = [];
        let index = 1;

        if (device_id) {
            conditions.push(`device_id = $${index++}`);
            values.push(device_id);
        }
        if (alert_type) {
            conditions.push(`alert_type = $${index++}`);
            values.push(alert_type);
        }
        if (date) {
            conditions.push(`date = $${index++}`);
            values.push(date);
        }
        if (details) {
            conditions.push(`details ILIKE $${index++}`);
            values.push(`%${details}%`);
        }

        const query = `SELECT * FROM alerts ${conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : ""}`;
        
        try {
            const result = await db.query(query, values);
            return result.rows;
        } catch (error) {
            console.error("Error fetching alerts by partial input:", error);
            throw new Error("Could not retrieve alerts.");
        }
    };

    static async updateAlert(alert_id: number, updates: Partial<Omit<Alert, "alert_id">>): Promise<void> {
        const setClauses = [];
        const values: any[] = [];
        let index = 1;

        for (const [key, value] of Object.entries(updates)) {
            setClauses.push(`${key} = $${index}`);
            values.push(value);
            index++;
        }

        if (setClauses.length === 0) {
            throw new Error("No fields to update.");
        }

        values.push(alert_id); // Add alert_id as the last parameter
        const query = `UPDATE alerts SET ${setClauses.join(", ")} WHERE alert_id = $${index}`;

        try {
            await db.query(query, values);
        } catch (error) {
            console.error("Error updating alert:", error);
            throw new Error("Could not update alert.");
        }
    }

    // Fetch the most recent N alerts by date and time
    static getRecentAlerts = async (limit: number): Promise<Alert[]> => {
        try {
            const query = `
                SELECT * FROM alerts
                ORDER BY date DESC, timestamp DESC
                LIMIT $1;
            `;
            const result = await db.query(query, [limit]);
            return result.rows;
        } catch (error) {
            console.error("Error fetching recent alerts:", error);
            throw new Error("Could not retrieve recent alerts.");
        }
    };
}

export default AlertModel;
