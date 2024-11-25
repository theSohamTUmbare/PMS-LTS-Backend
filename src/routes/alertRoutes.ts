import { Router } from 'express';
import * as AlertController from '../controllers/alertsController'
import verifyToken from '../middlewares/authMiddleware';

const router = Router();

router.get('/all',verifyToken, AlertController.getAlerts);          // Route to get all 
router.get('/prisoneralerts',verifyToken, AlertController.getPrisonerAlerts);          // Route to get all 
router.get('/get/:id', verifyToken, AlertController.getAlertById);
router.post('/addAlert', verifyToken, AlertController.addAlert);
router.put('/updateAlert/:id', verifyToken, AlertController.updateAlertById);
router.get('/filter', verifyToken, AlertController.getAlertsByPartialInput)
router.get('/recent', verifyToken, AlertController.getRecentAlerts)


export default router;
