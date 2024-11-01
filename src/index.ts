import express, {Request, Response} from 'express';
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
app.use(cors());

app.get("/api/test", (req: Request, res: Response) => {
    res.json({message: "Hello from Express"})
});

app.use("/api/v1/prisoner", prisonerRoutes);
app.use("/api/staff",staffRoutes);
app.use("/api/v1/admin", adminRoutes);

app.listen(7000, () => {
    console.log("Server Running at localhost:7000")
});

