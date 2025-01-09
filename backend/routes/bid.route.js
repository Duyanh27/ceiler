import express from 'express';
import { createBid, getBidHistory, getUserBids } from '../controllers/bid.controller.js';

const router = express.Router();

router.post('/', createBid);
router.get('/history/:itemId', getBidHistory);
router.get('/user', getUserBids);

export default router;