import db from "../config/db";
import L from "leaflet";

export interface GeofenceCircle {
  geofence_id: string;
  name: string;
  type: "Circle";
  radius: number;
  center_lat: number;
  center_lng: number;
}

export interface GeofencePolygon {
  geofence_id: string;
  name: string;
  type: "Polygon";
  coordinates: { lat: number; lng: number }[];
}

export interface GeofenceRectangle {
  geofence_id: string;
  name: string;
  type: "Rectangle";
  coordinates: { lat: number; lng: number }[];
}

export type Geofence = GeofenceCircle | GeofencePolygon | GeofenceRectangle;

class GeofenceModel {
  static getGeofences = async (): Promise<Geofence[]> => {
    try {
      const circleResult = await db.query("SELECT * FROM geofences WHERE type = 'Circle'");
      const polygonResult = await db.query("SELECT * FROM geofences WHERE type = 'Polygon'");
      const rectangleResult = await db.query("SELECT * FROM geofences WHERE type = 'Rectangle'");
      return [
        ...circleResult.rows,
        ...polygonResult.rows,
        ...rectangleResult.rows,
      ];
    } catch (error) {
      console.error("Error fetching geofences:", error);
      throw new Error("Could not retrieve geofences.");
    }
  };

  static getGeofenceById = async (id: string): Promise<Geofence | null> => {
    try {
      const result = await db.query("SELECT * FROM geofences WHERE geofence_id = $1", [id]);
      return result.rows[0] || null;
      } catch (error) {
        console.error("Error fetching geofence by id:", error);
        throw new Error("Could not retrieve geofence by id.");
        }
  }

  // Overloaded function declarations
  static addGeofence(geofence: GeofenceCircle): Promise<void>;
  static addGeofence(geofence: GeofencePolygon): Promise<void>;
  static addGeofence(geofence: GeofenceRectangle): Promise<void>;

  // Single implementation
  static async addGeofence(geofence: Geofence): Promise<void> {
    try {
      if (geofence.type === "Circle") {
        // Handle Circle geofence
        await db.query(
          "INSERT INTO geofences (geofence_id, name, type, radius, center_lat, center_lng) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            geofence.geofence_id,
            geofence.name,
            geofence.type,
            geofence.radius,
            geofence.center_lat,
            geofence.center_lng,
          ]
        );
      } else if (geofence.type === "Polygon" || geofence.type === "Rectangle") {
        // Handle Polygon or Rectangle geofence
        await db.query(
          "INSERT INTO geofences (geofence_id, name, type, coordinates) VALUES ($1, $2, $3, $4)",
          [geofence.geofence_id, geofence.name, geofence.type, JSON.stringify(geofence.coordinates)]
        );
      } else {
        throw new Error("Unsupported geofence type.");
      }
    } catch (error) {
      console.error("Error adding geofence:", error);
      throw new Error("Could not add geofence.");
    }
  }

  static deleteGeofence = async (id: string): Promise<void> => {
    try {
      // const geofence = await this.getGeofenceById(id);
      // if (geofence) {
        await db.query("DELETE FROM geofences WHERE geofence_id = $1", [id]);
      // }else{
      //   throw new Error("Geofence not found");
      // }
    } catch (error) {
        console.error("Error deleting geofence:", error);
        throw new Error("Could not delete geofence.");
    }
  }
}

export default GeofenceModel;
