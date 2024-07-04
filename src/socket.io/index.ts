import { Server } from "socket.io";
import { SessionIncomingMessage } from "../types";
import { UnauthorizedError } from "../apis/gateway";
import { GatewayService } from "../services/gateway";

export const register = (io: Server) => {
    GatewayService.subscribe((event) => {
        io.to(event.sessionId).emit("sms:received", event);
    });

    io.on("connection", (socket) => {
        const req = <SessionIncomingMessage>socket.request;

        socket.join(req.session.id);

        socket.use((data, next) => {
            console.debug(data);
            req.session.reload((err: any) => {
                if (err) {
                    console.error(err);
                    socket.disconnect();
                } else {
                    next();
                }
            });
        });

        socket.on('login', async (data) => {
            try {
                await GatewayService.login(req.session.id, data.login, data.password);
                req.session.login = data.login;
                req.session.password = data.password;
                req.session.save((err) => {
                    if (err) {
                        console.error(err);
                    }
                });

                socket.emit('login:success');
            } catch (error: Error | any) {
                socket.emit('login:fail', { message: error.message });
            }
        });

        socket.on('sms:send', async (data, callback) => {
            try {
                await GatewayService.send(req.session.id, data.phoneNumber, data.message);
                callback({ success: true });
            } catch (error: Error | any) {
                callback({ success: false, message: error.message });

                if (error instanceof UnauthorizedError) {
                    socket.emit('login:fail', { message: error.message });
                }
            }
        });

        socket.on('logout', async () => {
            try {
                await GatewayService.logout(req.session.id);

                req.session.destroy((err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            } catch (e) {
                console.error(e);
            }
            socket.emit('login:fail');
        });

        console.log(`user connected: ${req.session.id}`);
        if (req.session.login && req.session.password) {
            socket.emit('login:success');
        }

        socket.on("disconnect", async () => {
            try {
                await GatewayService.logout(req.session.id);
            } catch (e) {
                console.error(e);
            }
            console.log(`user disconnected: ${req.session.id}`);
        });
    });
}