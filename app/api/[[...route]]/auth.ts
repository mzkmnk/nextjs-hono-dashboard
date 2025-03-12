import { db } from "@/db";
import { users, userSignUpSchema } from "@/db/schema";
import { Hono } from "hono";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { DatabaseError } from "pg";
import { is } from "drizzle-orm";
import { PostgresError } from "postgres";

const app = new Hono().post("/sign-up", async (c) => {
  try {
    const result = userSignUpSchema.parse(await c.req.json());

    const { email, password } = result;

    const hashedPassword = await bcrypt.hash(password, 10);

    const res = await db.insert(users).values({
      email,
      password: hashedPassword,
    });

    c.status(201);

    return c.json({
      message: "User created successfully",
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      c.status(400);
      return c.json({
        message: "required email and password",
      });
    }

    // https://github.com/drizzle-team/drizzle-orm/issues/376
    if (typeof err === "object" && err !== null && "code" in err) {
      if (err.code === "23505") {
        c.status(409);
        return c.json({
          message: "Email already exists",
        });
      }
    }

    c.status(500);
    return c.json({
      message: "Internal server error",
    });
  }
});

export default app;
