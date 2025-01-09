import express from 'express';
import { 
    getAllItems, 
    getItemById, 
    createItem, 
    updateItem, 
    deleteItem,
    markItemAsCompleted 
} from '../controllers/item.controller.js';

const router = express.Router();

router.get('/', getAllItems);
router.get('/:id', getItemById);
router.post('/', createItem);
router.put('/:id', updateItem);
router.delete('/:id', deleteItem);
router.post('/:id/complete', markItemAsCompleted);

export default router;