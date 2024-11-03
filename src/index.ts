import express, {Request, Response} from 'express';
import { Server } from "socket.io";
import http from "http";
import cookieParser from "cookie-parser";
import cors from 'cors';
import "dotenv/config";
import prisonerRoutes from './routes/prisonerRoutes';
import staffRoutes from './routes/StaffRoutes';
import adminRoutes from './routes/authRoutes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ["GET", "POST"],
        credentials: true
    }
});


let currentLocation = { lat: 51.505, lng: -0.09 }; // Initial location

// Mock function to update the location
const updateLocation = () => {
  // Simulate location changes
  currentLocation.lat += 0.001; // Increment latitude
  currentLocation.lng += 0.001; // Increment longitude
};

// Emit location updates every 2 seconds
setInterval(() => { 
  updateLocation(); // Update the location
  io.emit("locationUpdate", currentLocation); // Emit the updated location
}, 2000);

// Serve a simple API endpoint if needed
// app.get("/api/location", (req, res) => {
//   res.json(currentLocation);
// });

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


app.get("/api/test", (req: Request, res: Response) => {
    res.json({message: "Hello from Express"})
});

app.use("/api/v1/prisoner", prisonerRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/staff",staffRoutes);

server.listen(7000, () => {
    console.log("Server Running at localhost:7000")
});


