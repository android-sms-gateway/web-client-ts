import session from "express-session";

export default ({ secret }: { secret: string }) => {
    return session({
        secret: secret,
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: "auto",
        },
    });
}