import express, { Request, Response } from 'express';
import { Server } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";
import cors from 'cors';
import "dotenv/config";
import prisonerRoutes from './routes/prisonerRoutes';
import staffRoutes from './routes/StaffRoutes';
import adminRoutes from './routes/authRoutes';
import cell_controls from './routes/cellControls';
import admin_approvalRoutes from './routes/admin_approvalRoutes';
import deviceRoutes from './routes/deviceRoutes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 7000;
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"],
  }
});

interface LocationData {
  id?: string;
  name: string;
  trackingId: number;
  latitude: number;
  longitude: number;
}

interface ClientsLocations {
  [socketId: string]: LocationData;
}

// In-memory storage for client locations
let clientsLocations: ClientsLocations = {};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Send existing location data to the newly connected client
  socket.emit("locationUpdate", clientsLocations);

  // Listen for location updates
  socket.on('updateLocation', (data: LocationData) => {
    clientsLocations[socket.id] = { ...data, id: socket.id };
    console.log(`Location for ${socket.id}:`, clientsLocations[socket.id]);

    // Emit updated locations to all connected clients
    io.emit("locationUpdate", clientsLocations);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    io.emit('userDisconnected', socket.id);
    delete clientsLocations[socket.id];
  });
});

// Endpoint to retrieve current locations (for clients opening the map in a new tab)
app.get('/api/v1/locations', (req: Request, res: Response) => {
  res.json(Object.values(clientsLocations));
});

app.get("/api/test", (req: Request, res: Response) => {
  res.json({ message: "Hello from Express" });
});

app.use("/api/v1/prisoner", prisonerRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/staff", staffRoutes);
app.use("/api/v1/admin_approval", admin_approvalRoutes);
app.use("/api/v1/cell_controls", cell_controls);
app.use("/api/v1/device", deviceRoutes);

server.listen(PORT, () => {
  console.log("Server running at http://localhost:7000");
});
