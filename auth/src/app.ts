import express from "express";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorMiddleware, unhandledRouteMiddleWare } from "@tickethub-kv/common";

import usersRouter from "./routes/users-route";

const app = express();

app.set("trust proxy", true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test"
}));

app.use("/api/users", usersRouter);

// handle unhandled routes
app.use(unhandledRouteMiddleWare);

// default error handler
app.use(errorMiddleware);

export { app };