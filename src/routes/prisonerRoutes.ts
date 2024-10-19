import express, {Request, Response} from "express";
import PrisonerModel from "../models/prisoner";
import * as controller from "../controllers/prisonerController"
import "dotenv/config";

const router = express.Router();

router.post("/all",controller.getPrisoners);
router.post("/add",);

router.put("/add", async (req: Request, res: Response) => {
    
});

export default router;