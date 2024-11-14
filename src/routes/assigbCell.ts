import { Router } from 'express';
import * as cellController from "../controllers/cellController";
import verifyToken from '../middlewares/authMiddleware';
const router = Router();

router.get('/cells', verifyToken,cellController.getCells);          // Route to get all cells
router.get('/cells/:id',verifyToken, cellController.getCellById);   // Route to get a specific cell by ID
router.post('/cells', verifyToken,cellController.createCell);       // Route to create a new cell
router.put('/cells/:id',verifyToken, cellController.updateCell);    // Route to update an existing cell by ID
router.delete('/cells/:id',verifyToken, cellController.deleteCell); // Route to delete a cell by ID
router.post('/cells/assign',verifyToken, cellController.assignCell);    // Route to assign cells based on block and sorting criteria

export default router;
