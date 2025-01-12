// webhook.route.js
import express from "express";
import bodyParser from "body-parser";
import { handleWebhookEvent } from "../controller/webhook.controller.js";

const router = express.Router();

// Configure body-parser for raw bodies
router.post(
    '/',
    bodyParser.raw({ type: 'application/json' }),
    (req, res, next) => {
        // Log incoming webhook request
        console.log('Webhook request received:', {
            method: req.method,
            url: req.url,
            headers: {
                'content-type': req.headers['content-type'],
                'svix-id': req.headers['svix-id'],
                'svix-timestamp': req.headers['svix-timestamp'],
                'svix-signature': req.headers['svix-signature']?.substring(0, 32) + '...'
            }
        });
        next();
    },
    handleWebhookEvent
);

export default router;