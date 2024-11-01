import express, {Request, Response} from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import "dotenv/config";
import prisonerRoutes from './routes/prisonerRoutes';
<<<<<<< HEAD

=======
import adminRoutes from './routes/authRoutes';
import staffRoutes from './routes/StaffRoutes';
>>>>>>> 56d3f918062a22b7c2ccdc8c31210db092c48e54

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());

app.get("/api/test", (req: Request, res: Response) => {
    res.json({message: "Hello from Express"})
});

app.use("/api/v1/prisoner", prisonerRoutes);
<<<<<<< HEAD


=======
app.use("/api/v1/admin", adminRoutes);
app.use("/api/staff",staffRoutes);
>>>>>>> 56d3f918062a22b7c2ccdc8c31210db092c48e54

app.listen(7000, () => {
    console.log("Server Running at localhost:7000")
});

