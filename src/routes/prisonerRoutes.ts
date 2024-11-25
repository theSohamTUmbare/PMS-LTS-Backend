import express, {Request, Response} from "express";
import verifyToken from "../middlewares/authMiddleware";
import * as controller from "../controllers/prisonerController"
import "dotenv/config";

const router = express.Router();    

router.get("/all",verifyToken,controller.getPrisoners);
router.post("/add",verifyToken, controller.createPrisoner);
router.put("/update/:id",verifyToken, controller.updatePrisoner);
router.delete("/delete/:id",verifyToken, controller.deletePrisoner);
router.get("/name",verifyToken, controller.searchPrisonerByName);
router.post("/search",verifyToken, controller.search);

router.get("/mobile/all",controller.getPrisoners);
router.put("/mobile/update/:id", controller.updatePrisoner);

export default router;