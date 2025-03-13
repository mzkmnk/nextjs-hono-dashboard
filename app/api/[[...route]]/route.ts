import { Hono } from "hono";
import { handle } from "hono/vercel";
import auth from "./auth/route";
export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const route = app.route("/auth", auth);

export type AppType = typeof route;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
