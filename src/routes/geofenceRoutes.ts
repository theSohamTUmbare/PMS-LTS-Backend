import express from 'express';
import verifyToken from '../middlewares/authMiddleware';
import * as controller from '../controllers/geofenceController';

const router = express.Router();

router.get("/all", verifyToken, controller.getGeofences);
router.post("/add", verifyToken, controller.addGeofence);
router.delete("/delete/:id", verifyToken, controller.deleteGeofence);

export default router;