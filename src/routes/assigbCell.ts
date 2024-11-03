import { Router } from 'express';
import * as cellController from "../controllers/cellController";

const router = Router();

router.get('/cells', cellController.getCells);          // Route to get all cells
router.get('/cells/:id', cellController.getCellById);   // Route to get a specific cell by ID
router.post('/cells', cellController.createCell);       // Route to create a new cell
router.put('/cells/:id', cellController.updateCell);    // Route to update an existing cell by ID
router.delete('/cells/:id', cellController.deleteCell); // Route to delete a cell by ID
router.post('/cells/assign', cellController.assignCell);    // Route to assign cells based on block and sorting criteria

export default router;
