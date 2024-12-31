import express from 'express';
import { handleWebhook } from '../controller/userWebhook.controller.js';

const router = express.Router();

// Define the webhook route
router.post('/api/webhooks', handleWebhook);

export default router;