import express, {Request, Response} from "express";
import verifyToken from "../middlewares/authMiddleware";
import * as controller from "../controllers/prisonerController"
import "dotenv/config";

const router = express.Router();    

router.get("/all", verifyToken,verifyToken,controller.getPrisoners);
router.post("/add", verifyToken,verifyToken, controller.createPrisoner);
router.put("/update/:id", verifyToken,verifyToken, controller.updatePrisoner);
router.delete("/delete/:id", verifyToken,verifyToken, controller.deletePrisoner);
router.get("/search", verifyToken,verifyToken, controller.searchPrisonerByName);
router.get("/prisonerid/:id", verifyToken,verifyToken, controller.getPrisonersById);

router.get("/mobile/all",controller.getPrisoners);
router.put("/mobile/update/:id", controller.updatePrisoner);

export default router;