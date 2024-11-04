import db from "../config/db";

export interface Cell{
    cell_id: number;
    block: string;
    capacity: number;
    current_occupants: number;
    security_level: string;
    guard_assignment?: string;
}

class CellModel {
    static getCells = async (): Promise<Cell[]> => {
        try {
            const result = await db.query("SELECT * FROM cells");
            return result.rows;
        } catch (error) {
            console.error("Error fetching cells:", error);
            throw new Error("Could not retrieve cells.");
        }
    }

    static getCellById = async (id: number): Promise<Cell | null> => {
        try {
            const result = await db.query("SELECT * FROM cells WHERE cell_id = $1", [id]);
            if (result.rows.length > 0) {
                return result.rows[0];
            }
            return null;
        } catch (error) {
            console.error("Error fetching cell:", error);
            throw new Error("Could not retrieve the cell.");
        }
    };

    static createCell = async (cell: Cell): Promise<void> => {
        const { block, capacity, current_occupants, security_level, guard_assignment } = cell;
        try {
            await db.query(
                "INSERT INTO cells (block, capacity, current_occupants, security_level, guard_assignment) VALUES ($1, $2, $3, $4, $5)",
                [block, capacity, current_occupants, security_level, guard_assignment]
            );
        } catch (error) {
            console.error("Error creating cell:", error);
            throw new Error("Could not create the cell.");
        }
    };

    static updateCell = async (id: number, cell: Partial<Cell>): Promise<void> => {
        const { block, capacity, current_occupants, security_level, guard_assignment } = cell;
        try {
            await db.query(
                "UPDATE cells SET block = COALESCE($1, block), capacity = COALESCE($2, capacity), current_occupants = COALESCE($3, current_occupants), security_level = COALESCE($4, security_level), guard_assignment = COALESCE($5, guard_assignment) WHERE cell_id = $6",
                [block, capacity, current_occupants, security_level, guard_assignment, id]
            );
        } catch (error) {
            console.error("Error updating cell:", error);
            throw new Error("Could not update the cell.");
        }
    };

    static deleteCell = async (id: number): Promise<void> => {
        try {
            await db.query("DELETE FROM cells WHERE cell_id = $1", [id]);
        } catch (error) {
            console.error("Error deleting cell:", error);
            throw new Error("Could not delete the cell.");
        }
    };

    static assignCell = async (block: string, sortBy: 'crowding' | 'security'): Promise<Pick<Cell, 'cell_id' | 'block' | 'capacity' | 'current_occupants' | 'security_level'>[]> => {
        
        let sortQuery = "";
    
        switch (sortBy) {
            case 'crowding':
                sortQuery = "current_occupants::float / capacity ASC";  // Less crowded cells first
                break;
            case 'security':
                sortQuery = "security_level DESC";  // Higher security level first
                break;
            default:
                sortQuery = "current_occupants::float / capacity ASC, security_level DESC"; // Default sort
        }
    
        try {
            const result = await db.query(
                `SELECT cell_id, block, capacity, current_occupants, security_level
                 FROM cells
                 WHERE block = $1 AND current_occupants < capacity
                 ORDER BY ${sortQuery}`,
                [block]
            );
            return result.rows;
        } catch (error) {
            console.error("Error fetching sorted cells for assignment:", error);
            throw new Error("Could not retrieve sorted cells for assignment.");
        }
    };
    

}

export default CellModel;
