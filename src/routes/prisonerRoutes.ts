import express, {Request, Response} from "express";
import PrisonerModel from "../models/prisoner";
import * as controller from "../controllers/prisonerController"
import "dotenv/config";

const router = express.Router();

router.get("/all",controller.getPrisoners);
router.post("/add",controller.createPrisoner);
router.put("/update/:id", controller.updatePrisoner);
router.delete("/delete/:id", controller.deletePrisoner);
router.get("/search", controller.searchPrisonerByName);

export default router;