import express, { Request, Response } from 'express';
import { Server } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";
import cors from 'cors';
import "dotenv/config";
import prisonerRoutes from './routes/prisonerRoutes';
import staffRoutes from './routes/StaffRoutes';
import adminRoutes from './routes/authRoutes';
import cell_controls from './routes/cellControls'
import admin_approvalRoutes from './routes/admin_approvalRoutes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"],
    // credentials: true
  }
});

interface LocationData {
  latitude: number;
  longitude: number;
  [key: string]: any; // Optional additional fields
}

interface ClientsLocations {
  [socketId: string]: LocationData;
}

// let currentLocation = { lat: 51.505, lng: -0.09 }; // Initial location

// // Socket.IO connection
// io.on('connection', (socket) => {
//   console.log('A user connected');

//   socket.on('updateLocation', (data) => {
//     console.log('Received location update:', data);
//     currentLocation.lat = data.latitude,
//     currentLocation.  lng = data.longitude
//     io.emit("locationUpdate", currentLocation);
//   });

//   socket.on('disconnect', () => {
//     console.log('User disconnected');
//   });
// });

let clientsLocations: ClientsLocations = {}; // Store locations with socket IDs as keys

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for location updates
  socket.on('updateLocation', (data: LocationData) => {
    clientsLocations[socket.id] = data; // Store location data with socket ID
    console.log(`Updated location for ${socket.id}:`, data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    delete clientsLocations[socket.id]; // Remove the location on disconnect
  });
});

// Endpoint to get all client locations
app.get('/api/v1/locations', (req: Request, res: Response) => {
  res.json(Object.values(clientsLocations)); // Return all locations as an array
});

// Test endpoint
app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express" });
});

app.use("/api/v1/prisoner", prisonerRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/staff",staffRoutes);
app.use("/api/v1/admin_approval",admin_approvalRoutes);
app.use("/api/v1/cell_controls", cell_controls)

server.listen(7000, () => {
  console.log("Server running at http://localhost:7000");
});
