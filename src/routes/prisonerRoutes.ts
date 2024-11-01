import express, {Request, Response} from "express";
import PrisonerModel from "../models/prisoner";
import verifyToken from "../middlewares/authMiddleware";
import * as controller from "../controllers/prisonerController"
import "dotenv/config";

const router = express.Router();    

router.get("/all", verifyToken, controller.getPrisoners);
router.post("/add", verifyToken, controller.createPrisoner);
router.put("/update/:id", verifyToken, controller.updatePrisoner);
router.delete("/delete/:id", verifyToken, controller.deletePrisoner);
router.get("/search", verifyToken, controller.searchPrisonerByName);

export default router;