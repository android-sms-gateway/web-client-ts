import EventEmitter from "events";

import { GatewayApi, WebHookEvent, WebHookPayloadSmsReceived } from "../apis/gateway";
import { gateway as config } from "../config";

export interface MessageEvent {
    sessionId: string;
    phoneNumber: string;
    message: string;
    receivedAt: Date;
}

const WEBHOOK_ID = "web-client-ts";

const sessions: Record<string, GatewayApi> = {

};

const events: EventEmitter<{ "message": MessageEvent[] }> = new EventEmitter();

const processWebhook = (sessionId: string, event: WebHookEvent<WebHookPayloadSmsReceived>) => {
    if (event.event !== "sms:received") {
        return;
    }

    events.emit("message", {
        sessionId: sessionId,
        phoneNumber: event.payload.phoneNumber,
        message: event.payload.message,
        receivedAt: new Date(event.payload.receivedAt),
    });
}

const login = async (sessionId: string, login: string, password: string) => {
    if (!sessions[sessionId]) {
        sessions[sessionId] = new GatewayApi(login, password);
    }

    const api = sessions[sessionId];
    api.updateCredentials(login, password);
    await api.webhookRegister(WEBHOOK_ID, `${config.webhookUrl}?sessionId=${sessionId}`);
}

const subscribe = (callback: (event: MessageEvent) => void) => {
    events.on("message", callback);
}

const send = async (sessionId: string, phoneNumber: string, message: string) => {
    const api = sessions[sessionId];
    if (!api) {
        throw new Error(`Session ${sessionId} not found`);
    }

    await api.sendMessage(phoneNumber, message);
}

const logout = async (sessionId: string) => {
    const api = sessions[sessionId];
    if (api) {
        await api.webhookUnregister(WEBHOOK_ID);
    }
    delete sessions[sessionId];
}

export const GatewayService = { login, logout, send, subscribe, processWebhook }