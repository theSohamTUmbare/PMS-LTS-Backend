import express, {Request, Response} from "express";
import PrisonerModel from "../models/prisoner";
import * as controller from "../controllers/prisonerController"
import "dotenv/config";

const router = express.Router();

router.get("/all",controller.getPrisoners);
router.post("/add",);

export default router;