import {Request, Response} from "express";
import CellModel, {Cell} from "../models/cell"

// Get all cells
export const getCells = async (req: Request, res: Response): Promise<void> => {
    try {
        const cells = await CellModel.getCells();
        res.status(200).json({ data: cells, message: "Cells retrieved successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving cells" });
    }
};

// Get a specific cell by ID
export const getCellById = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    // console.log(req)
    try {
        const cell = await CellModel.getCellById(id);
        if (cell) {
            res.status(200).json({ data: cell, message: "Cell retrieved successfully" });
        } else {
            res.status(404).json({ message: "Cell not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error retrieving cell" });
    }
};

// Create a new cell
export const createCell = async (req: Request, res: Response): Promise<void> => {
    const cellData: Cell = req.body;
    try {
        await CellModel.createCell(cellData);
        res.status(201).json({ message: "Cell created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating cell" });
    }
};

// Update an existing cell by ID
export const updateCell = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    const cellData: Partial<Cell> = req.body;
    try {
        await CellModel.updateCell(id, cellData);
        res.status(200).json({ message: "Cell updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating cell" });
    }
};

// Delete a cell by ID
export const deleteCell = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try {
        await CellModel.deleteCell(id);
        res.status(200).json({ message: "Cell deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting cell" });
    }
};

export const addOccupant = async (req: Request, res: Response): Promise<void> =>{
    console.log("got")
    const id = parseInt(req.params.id);
    try {
        await CellModel.addOccupant(id);
        res.status(200).json({ message: "Added occupant successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error added occupant" });
    }
}


// Assign cells based on block and sorting criteria
export const assignCell = async (req: Request, res: Response): Promise<void> => {
    const block = req.body.block; // Assume block is passed in the body
    const sortBy: 'crowding' | 'security' = req.body.sortBy; // Assume sorting option is also in the body

    if (!block || !sortBy) {
        res.status(400).json({ message: "Block and sortBy parameters are required." });
        return;
    }

    try {
        const cells = await CellModel.assignCell(block, sortBy);
        res.status(200).json({ data: cells, message: "Recommended cells retrieved successfully." });
    } catch (error) {
        console.error("Error fetching recommended cells:", error);
        res.status(500).json({ message: "Error retrieving recommended cells." });
    }
};


// Get distinct blocks
export const getBlocks = async (req: Request, res: Response): Promise<void> => {
    try {
        const blocks = await CellModel.getBlocks();
        res.status(200).json({ data: blocks, message: "Blocks retrieved successfully" });
    } catch (error) {
        console.error("Error fetching blocks:", error);
        res.status(500).json({ message: "Error retrieving blocks." });
    }
};


export const getCellsByBlock = async (req: Request, res: Response): Promise<void> => {
    const block = req.query.block as string;
    // console.log(block)
    try {
        let cells;
        
        if (block) {
            // Fetch cells for the specified block
            cells = await CellModel.getCellsByBlock(block);
        } else {
            // Fetch all cells if no block is specified
            cells = await CellModel.getCells();
        }

        res.status(200).json({ data: cells, message: "Cells retrieved successfully" });
    } catch (error) {
        console.error("Error retrieving cells:", error);
        res.status(500).json({ message: "Error retrieving cells" });
    }
};