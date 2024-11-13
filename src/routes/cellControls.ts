import { Router } from 'express';
import * as cellController from "../controllers/cellController";
import verifyToken from '../middlewares/authMiddleware';

const router = Router();

router.get('/all',verifyToken, cellController.getCells);          // Route to get all cells
router.get('/cell/:id',verifyToken, cellController.getCellById);   // Route to get a specific cell by ID
router.post('/cells',verifyToken, cellController.createCell);       // Route to create a new cell
router.put('cell/:id',verifyToken, cellController.updateCell);    // Route to update an existing cell by ID
router.delete('delete/:id',verifyToken, cellController.deleteCell); // Route to delete a cell by ID
router.post('/assign',verifyToken, cellController.assignCell);    // Route to assign cells based on block and sorting criteria
router.get("/blocks",verifyToken, cellController.getBlocks);  // get blocks
router.get('/block',verifyToken, cellController.getCellsByBlock); // Route to get cells by a specific block
router.get('/addOccupant/:id',verifyToken, cellController.addOccupant); // Route to get cells by a specific block

export default router;
