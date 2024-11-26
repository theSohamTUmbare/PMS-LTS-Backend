import { Request, Response } from "express";
import GeofenceModel from "../models/geofence";
import {
  Geofence,
  GeofenceCircle,
  GeofencePolygon,
  GeofenceRectangle,
} from "../models/geofence";

export const getGeofences = async (req: Request, res: Response): Promise<void> => {
  try {
    const geofences: Geofence[] = await GeofenceModel.getGeofences();
    res.status(200).json(geofences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to get geofences" });
  }
};

export const addGeofence = async (req: Request, res: Response): Promise<void> => {
  try {
    let geofence: Geofence;
    if (req.body.shape === "Circle") {
      geofence = req.body as GeofenceCircle;
      await GeofenceModel.addGeofence(geofence);
    } else if (req.body.shape === "Polygon") {
      geofence = req.body as GeofencePolygon;
      await GeofenceModel.addGeofence(geofence);
    } else if (req.body.shape === "Rectangle") {
      geofence = req.body as GeofenceRectangle;
      await GeofenceModel.addGeofence(geofence);
    } else {
      res.status(400).json({ message: "Invalid geofence shape" });
      return;
    }

    res.status(201).json({ message: "Geofence added successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to add geofence" });
  }
};

export const deleteGeofence = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;
  try {
    const geofence = await GeofenceModel.getGeofenceById(id);
    if (!geofence) {
      res.status(404).json({ message: "Geofence not found" });
      return;
    }
    await GeofenceModel.deleteGeofence(id);
    res.status(200).json({ message: "Geofence deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete geofence" });
  }
};
