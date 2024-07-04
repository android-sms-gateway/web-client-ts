import { Router } from "express";
import { GatewayService } from "../../services/gateway";


export const router = Router();

router.post("/", (req, res) => {
    GatewayService.processWebhook(req.query.sessionId as string, req.body);
    res.sendStatus(200);
});