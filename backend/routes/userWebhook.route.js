import express from 'express';
import { handleWebhook } from '../controllers/userWebhook.controller.js';

const router = express.Router();

router.post('/api/webhooks', handleWebhook);

export default router;