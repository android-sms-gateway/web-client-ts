import { randomBytes } from "crypto";
import dotenv from "dotenv";

dotenv.config();

export interface HttpConfig {
    port: number;
    sessionSecret: string;
}

export interface GatewayConfig {
    url: string;
    webhookUrl: string;
}

const httpPort = Number(process.env.HTTP__PORT) || Number(process.env.PORT) || 3000;

export const http: HttpConfig = {
    port: httpPort,
    sessionSecret: process.env.HTTP__SESSION_SECRET || randomBytes(32).toString("hex"),
}

export const gateway: GatewayConfig = {
    url: process.env.GATEWAY__URL || "https://sms.capcom.me/api/3rdparty/v1",
    webhookUrl: process.env.GATEWAY__WEBHOOK_URL || `http://localhost:${httpPort}/api/webhooks`,
}

export const debug: boolean = process.env.NODE_ENV === "development";
