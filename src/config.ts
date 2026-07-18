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
export const debug: boolean = process.env.NODE_ENV === "development";

export const http: HttpConfig = {
    port: httpPort,
    sessionSecret: process.env.HTTP__SESSION_SECRET || randomBytes(32).toString("hex"),
}

const webhookUrl = process.env.GATEWAY__WEBHOOK_URL;
if (!webhookUrl) {
    throw new Error(
        "GATEWAY__WEBHOOK_URL must be set. " +
        "This is the publicly reachable URL of this server's webhook endpoint (e.g. https://your-domain.com/api/webhooks)."
    );
}
if (!debug && !webhookUrl.startsWith("https://")) {
    throw new Error(
        "GATEWAY__WEBHOOK_URL must use HTTPS in production. " +
        "Set NODE_ENV=development to allow HTTP for local testing."
    );
}
if (debug && webhookUrl.startsWith("http://") && !webhookUrl.includes("localhost")) {
    console.warn(
        "WARNING: GATEWAY__WEBHOOK_URL uses HTTP with a non-localhost address. " +
        "This is insecure. Use HTTPS in production."
    );
}

export const gateway: GatewayConfig = {
    url: process.env.GATEWAY__URL || "https://api.sms-gate.app/3rdparty/v1",
    webhookUrl,
}
