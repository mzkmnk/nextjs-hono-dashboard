import { Hono } from "hono";
import { handle } from "hono/vercel";
import { db } from "@/db/index";
import { users } from "@/db/schema";
export const runtime = "nodejs";

const app = new Hono().basePath("/api");

app.get("/hello", async (c) => {
  const res = await db.select().from(users);
  return c.json({
    message: res,
  });
});

export const GET = handle(app);
