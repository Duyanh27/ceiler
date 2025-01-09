import express from 'express';
import { 
    getAllCategories, 
    getSubcategories, 
    getCategoryById, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} from '../controllers/category.controller.js';

const router = express.Router();

router.get('/', getAllCategories);
router.get('/subcategories', getSubcategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
