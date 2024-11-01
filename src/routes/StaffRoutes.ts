import express, {request,Response} from "express";
import * as controller from "../controllers/staffController";
import "dotenv/config";
const router=express.Router();

router.get("/getall",controller.getStaff);
router.post("/add",controller.addStaff);
router.get("/get/:id", controller.getStaffById);  
router.put("/update/:id", controller.updateStaff);   
router.delete("/delete/:id", controller.deleteStaff); 
export default router;