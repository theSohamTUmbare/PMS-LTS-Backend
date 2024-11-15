import { Request, Response } from "express";
import DeviceModel, {Device} from "../models/device";

export const createDevice = async (req: Request, res: Response): Promise<void> => {
    const {device_id, assigned_to}: Device = req.body;
    try {
        await DeviceModel.addDevice({device_id, assigned_to});
        res.status(201).json({data: req.body, message: "Device created"});
    } catch(error){
        console.log(error);
        res.status(500).json({message: "Error adding device"})
    }
}

export const getDevices = async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    try {
        const totalDevices = await DeviceModel.getDeviceCount();
        const totalPages = Math.ceil(totalDevices / limit);

        const devices = await DeviceModel.getDevices(page, limit);

        res.status(200).json({
            devices,
            currentPage: page,
            totalPages,
            totalDevices,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Retrieving the devices" });
    }
};