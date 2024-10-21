import {Request, Response} from "express";
import PrisonerModel, {Prisoner} from "../models/prisoner";

export const getPrisoners = async (req: Request, res: Response): Promise<void> => {
    try{
        const prisoners = await PrisonerModel.getPrisoners();
        res.status(200).json({data: prisoners,  message: "Prisoners retrieved successfully"});
    } catch(error){
        console.log(error);
        res.status(500).json({message: "Error retrieving prisoners"});
    }
}

export const getPrisonersById  = async (req: Request, res: Response): Promise<void> => {
    const id = parseInt(req.params.id);
    try{
        const prisoners = await PrisonerModel.getPrisonerById(id);
        res.status(200).json({data: prisoners,  message: "Prisoners retrieved successfully"});
    } catch(error){
        console.log(error);
        res.status(500).json({message: "Error retrieving prisoners"});
    }
}
