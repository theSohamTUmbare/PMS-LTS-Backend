import db from "../config/db";

export interface Device {
    device_id: number,
    assigned_to: 'Prisoner' | 'Guard' | 'Police',
    battery_level?: number,
    signal_status?: 'Strong' | 'Weak' | 'Lost',
    status?: 'Active' | 'Inactive' | 'Malfunctioning',
}

class DeviceModel {
    static getDevices = async (page: number = 1, limit: number = 20): Promise<Device[]> => {
        try {
            const offset = (page - 1) * limit;
            const result = await db.query("SELECT * FROM trackingdevices LIMIT $1 OFFSET $2", [limit, offset]);
            return result.rows;
        } catch (error) {
            console.error("Error fetching devices:", error);
            throw new Error("Could not retrieve devices.");
        }
    }
    
    static addDevice = async (device: Device): Promise<void> => {
        try {
            // console.log(device);
            await db.query(
                "INSERT INTO trackingdevices (device_id, assigned_to) VALUES ($1, $2)",
                [device.device_id, device.assigned_to]
            );
        } catch (error) {
            console.error("Error adding device", error);
            throw new Error("Could not add device.");
        }
    }

    static getDeviceCount = async (): Promise<number> => {
        try {
            const result = await db.query("SELECT COUNT(*) FROM trackingdevices");
            return parseInt(result.rows[0].count, 10);
        } catch (error) {
            console.error("Error counting devices:", error);
            throw new Error("Could not retrieve devices count.");
        }
    };
}

export default DeviceModel;