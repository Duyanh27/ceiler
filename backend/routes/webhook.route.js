import express from "express";
import bodyParser from "body-parser";
import { handleWebhookEvent } from "../controller/webhook.controller.js";

const router = express.Router();

router.post(
  '/',
  bodyParser.raw({ type: 'application/json' }),
  handleWebhookEvent
);

export default router;