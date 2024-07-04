import express, { Express } from "express";
import { createServer } from "http";
import morgan from "morgan";
import { Server } from "socket.io";

import session from "./middlewares/session";

import * as config from "./config";
import * as api from "./routes/api";
import * as root from "./routes/root";

const port: number = config.http.port;
const app: Express = express();
const server = createServer(app);
const io = new Server(server);

const sessionMiddleware = session({ secret: config.http.sessionSecret });

if (config.debug) {
    app.use(morgan("dev"));
} else {
    app.use(morgan("combined"));
}

io.engine.use(sessionMiddleware);
require("./socket.io").register(io);

app.use("/api", api.router);
app.use("/", sessionMiddleware, root.router);

server.listen(port, () => {
    console.info(`[server] running at http://localhost:${port}`);
});

process.on('SIGINT', () => {
    shutdown();
});

process.on('SIGTERM', () => {
    shutdown();
});

function shutdown() {
    console.debug('[server] shutting down...');
    server.close(() => {
        console.debug('[server] server closed')
    });
}