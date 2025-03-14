import { Hono } from "hono";
import { handle } from "hono/vercel";
import { authRoute } from "./auth";
export const runtime = "nodejs";

const app = new Hono().basePath('/api').route("/auth",authRoute);

export type AppType = typeof app;

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
