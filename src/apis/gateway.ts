import { gateway } from "../config";

const BASE_URL = gateway.url;

export class GatewayApi {
    private authorization: string = "";

    constructor(
        login: string,
        password: string,
        private readonly url: string = BASE_URL
    ) {
        this.updateCredentials(login, password);
    }

    updateCredentials(login: string, password: string) {
        this.authorization = Buffer.from(`${login}:${password}`).toString("base64");
    }

    async webhookRegister(id: string, url: string) {
        await this.fetch("webhooks", {
            method: "POST",
            body: JSON.stringify({
                id,
                event: "sms:received",
                url,
            }),
        });
    }

    async webhookUnregister(id: string) {
        await this.fetch(`webhooks/${id}`, {
            method: "DELETE",
        });
    }

    async sendMessage(phoneNumber: string, message: string) {
        await this.fetch("message", {
            method: "POST",
            body: JSON.stringify({
                phoneNumbers: [
                    phoneNumber,
                ],
                message,
            }),
        });
    }

    private async fetch(path: string, init: RequestInit) {
        const response = await fetch(`${this.url}/${path}`, {
            ...init,
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${this.authorization}`,
            },
        });
        if (!response.ok) {
            if (response.status === 401) {
                throw new UnauthorizedError();
            }

            throw new Error(`API call to ${path} failed with ${response.status} ${response.statusText}: ${await response.text()}`);
        }
        return response;
    }
}

///////////////////////////////////////////////////////////////////////////////
export class UnauthorizedError extends Error { }

export type WebHookEventType = 'sms:received' | 'system:ping';

export type WebHookPayloadSmsReceived = {
    message: string,
    phoneNumber: string,
    receivedAt: string,
};

export interface WebHookEvent<T> {
    id: string;
    webhookId: string;
    deviceId: string;
    event: WebHookEventType;
    payload: T;
}