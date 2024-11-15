import {Request, Response} from "express";
import PrisonerModel, {Prisoner} from "../models/prisoner";

export const getPrisoners = async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    try {
        const totalPrisoners = await PrisonerModel.getPrisonerCount();
        const totalPages = Math.ceil(totalPrisoners / limit);

        const prisoners = await PrisonerModel.getPrisoners(page, limit);

        res.status(200).json({
            prisoners,
            currentPage: page,
            totalPages,
            totalPrisoners,
        });
    } catch (error) {
        res.status(500).json({ message: "Error Retrieving the prisoners" });
    }
};   


export const getPrisonersById  = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try{
        const prisoners = await PrisonerModel.getPrisonerById(id);
        res.status(200).json({data: prisoners,  message: "Prisoners retrieved successfully"});
    } catch(error){
        console.log(error);
        res.status(500).json({message: "Error retrieving prisoners"});
    }
};

export const  createPrisoner = async (req: Request, res: Response): Promise<void> => {
    const prisoner: Prisoner = req.body;
    try {
        const newPrisoner = await PrisonerModel.addPrisoner(prisoner);
        res.status(201).json({data: newPrisoner, message: "Prisoner created"});
    } catch(error){
        console.log(error);
        res.status(500).json({message:  "Error creating prisoner"});
        
    }
};

export const updatePrisoner = async (req: Request, res: Response): Promise<void> => {
    const data = req.body;
    const id = parseInt(req.params.id);
    try {
        const prisoner = await PrisonerModel.getPrisonerById(id);
        if (!prisoner) {
            res.status(404).json({ message: "Prisoner not found" });
            return;
        }
        await PrisonerModel.updatePrisoner(id, data);
        res.status(200).json({ message: "Prisoner updated successfully." });
    } catch(error){
        console.log(error);
        res.status(500).json({message: "Error updating prisoner"});
        
    }
};

export const deletePrisoner = async (req: Request,  res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try {
        const prisoner = PrisonerModel.getPrisonerById(id);
        if (!prisoner) {
            res.status(404).json({ message: "Prisoner not found" });
            return;
        }
        await PrisonerModel.deletePrisoner(id);
        res.status(200).json({ message: "Prisoner deleted successfully" });
    } catch(error){
        console.log(error);
        res.status(500).json({message: "Error deleting prisoner"});
    }
};


export const searchPrisonerByName = async (req: Request, res: Response): Promise<void> => {
    const { first_name, last_name } = req.query;

    if (!first_name) {
        res.status(400).json({ message: "First name is required for searching." });
        return;
    }

    try {
        const prisoner = await PrisonerModel.getPrisonerByName(first_name as string, last_name as string);
        if (!prisoner) {
            res.status(404).json({ message: "Prisoner not found." });
        } else {
            res.status(200).json(prisoner);
        }
    } catch (error) {
        console.error("Error searching for prisoner:", error);
        res.status(500).json({ message: "Error retrieving prisoner by name." });
    }
};

export const search = async (req: Request, res: Response): Promise<void> => {
    try {
        const criteria: Partial<Prisoner> = req.body;

        if (!Object.keys(criteria).length) {
            res.status(400).json({ error: "No criteria provided for search." });
            return;
        }

        const prisoners = await PrisonerModel.searchPrisoners(criteria);

        res.status(200).json(prisoners);
    } catch (error) {
        console.error("Error searching prisoners:", error);
        res.status(500).json({ error: "Could not search prisoners." });
    }
}


