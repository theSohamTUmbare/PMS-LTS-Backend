import db from "../config/db";
import L from "leaflet";

export interface GeofenceCircle {
  geofence_id: string;
  name: string;
  alert_type: "Informational" | "Warning" | "Critical";
  type: "Positive" | "Negative";
  shape: "Circle";
  radius: number;
  center_lat: number;
  center_lng: number;
}

export interface GeofencePolygon {
  geofence_id: string;
  name: string;
  alert_type: "Informational" | "Warning" | "Critical";
  type: "Positive" | "Negative";
  shape: "Polygon";
  coordinates: { lat: number; lng: number }[];
}

export interface GeofenceRectangle {
  geofence_id: string;
  name: string;
  alert_type: "Informational" | "Warning" | "Critical";
  type: "Positive" | "Negative";
  shape: "Rectangle";
  coordinates: { lat: number; lng: number }[];
}

export type Geofence = GeofenceCircle | GeofencePolygon | GeofenceRectangle;

class GeofenceModel {
  static getGeofences = async (): Promise<Geofence[]> => {
    try {
      const circleResult = await db.query(
        "SELECT * FROM geofences WHERE shape = 'Circle'"
      );
      const polygonResult = await db.query(
        "SELECT * FROM geofences WHERE shape = 'Polygon'"
      );
      const rectangleResult = await db.query(
        "SELECT * FROM geofences WHERE shape = 'Rectangle'"
      );
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
      const result = await db.query(
        "SELECT * FROM geofences WHERE geofence_id = $1",
        [id]
      );
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error fetching geofence by id:", error);
      throw new Error("Could not retrieve geofence by id.");
    }
  };

  // Overloaded function declarations
  static addGeofence(geofence: GeofenceCircle): Promise<void>;
  static addGeofence(geofence: GeofencePolygon): Promise<void>;
  static addGeofence(geofence: GeofenceRectangle): Promise<void>;

  // Single implementation
  static async addGeofence(geofence: Partial<Geofence>): Promise<void> {
    try {
      if (geofence.shape === "Circle") {
        // Handle Circle geofence
        await db.query(
          "INSERT INTO geofences (geofence_id, name, alert_type, type, shape, radius, center_lat, center_lng) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
          [
            geofence.geofence_id,
            geofence.name,
            geofence.alert_type,
            geofence.type,
            geofence.shape,
            geofence.radius,
            geofence.center_lat,
            geofence.center_lng,
          ]
        );
      } else if (
        geofence.shape === "Polygon" ||
        geofence.shape === "Rectangle"
      ) {
        // Handle Polygon or Rectangle geofence
        await db.query(
          "INSERT INTO geofences (geofence_id, name, alert_type, type, shape, coordinates) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            geofence.geofence_id,
            geofence.name,
            geofence.alert_type,
            geofence.type,
            geofence.shape,
            JSON.stringify(geofence.coordinates),
          ]
        );
      } else {
        throw new Error("Unsupported geofence shape.");
      }
    } catch (error) {
      console.error("Error adding geofence:", error);
      throw new Error("Could not add geofence.");
    }
  }

  static deleteGeofence = async (id: string): Promise<void> => {
    try {
      await db.query("DELETE FROM geofences WHERE geofence_id = $1", [id]);
    } catch (error) {
      console.error("Error deleting geofence:", error);
      throw new Error("Could not delete geofence.");
    }
  };
}

export default GeofenceModel;
