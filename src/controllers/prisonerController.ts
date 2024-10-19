import {Request, Response} from "express";
import PrisonerModel, {Prisoner} from "../models/prisoner";

export const getPrisoners = async (req: Request, res: Response) => {
    try{
        const prisoners = await PrisonerModel.getPrisoners();
        res.status(200).json({data: prisoners,  message: "Prisoners retrieved successfully"});
    } catch(error){
        console.log(error);
        res.status(500).json({message: "Error retrieving prisoners"});
    }
}

export const getPrisonerByCellId  = async (req: Request, res: Response) => {
    try{
        const prisoners = await PrisonerModel.getPrisoners();
        res.status(200).json({data: prisoners,  message: "Prisoners retrieved successfully"});
    } catch(error){
        console.log(error);
        res.status(500).json({message: "Error retrieving prisoners"});
    }
}
