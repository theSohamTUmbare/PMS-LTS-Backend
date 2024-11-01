import express, {Request, Response} from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors';
import "dotenv/config";
import prisonerRoutes from './routes/prisonerRoutes';


=======
import adminRoutes from './routes/authRoutes';
import staffRoutes from './routes/StaffRoutes';
>>>>>>> 56d3f918062a22b7c2ccdc8c31210db092c48e54
=======
import staffRoutes from './routes/StaffRoutes';
import adminRoutes from './routes/authRoutes';
>>>>>>> ef9751bca44212f98fba96ec26172bed43573bc7

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(cors());

app.get("/api/test", (req: Request, res: Response) => {
    res.json({message: "Hello from Express"})
});

app.use("/api/v1/prisoner", prisonerRoutes);



=======
app.use("/api/v1/admin", adminRoutes);
app.use("/api/staff",staffRoutes);
>>>>>>> 56d3f918062a22b7c2ccdc8c31210db092c48e54
=======
app.use("/api/v1/staff",staffRoutes);
app.use("/api/v1/admin", adminRoutes);
>>>>>>> ef9751bca44212f98fba96ec26172bed43573bc7

app.listen(7000, () => {
    console.log("Server Running at localhost:7000")
});

