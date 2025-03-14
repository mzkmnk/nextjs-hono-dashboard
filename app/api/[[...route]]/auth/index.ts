import { db } from "@/db";
import { users, userSignUpSchema } from "@/db/schema";
import { Hono } from "hono";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { verify } from "hono/jwt";
import { JWTPayload } from "hono/dist/types/utils/jwt/types";
import { HTTPException } from "hono/http-exception";
import { setCookies } from "./utils";

const app = new Hono();

app.post("/sign-in", async (c) => {
  const result = userSignUpSchema.parse(await c.req.json());

  const { email, password } = result;

  const [user] = await db.select().from(users).where(eq(users.email, email));

  // not exist user
  if (!user) {
    throw new HTTPException(404, { message: "User not found" });
  }

  // password not match
  if (!(await bcrypt.compare(password, user.password))) {
    throw new HTTPException(400, { message: "Password not match" });
  }

  await setCookies(user.id, c);

  c.status(200);

  return c.json({
    message: "Successfully signed in",
  });
});

app.post("/sign-up", async (c) => {
  const result = userSignUpSchema.parse(await c.req.json());

  const { email, password } = result;

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    id: uuidv4(),
    email,
    password: hashedPassword,
  });

  c.status(201);

  return c.json({
    message: "User created successfully",
  });
});

app.get("/refresh", async (c) => {
  const refreshToken = c.req.header("refreshToken");

  if (!refreshToken) {
    throw new HTTPException(401, { message: "Refresh token is required" });
  }

  const decoded = (await verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET!
  )) as JWTPayload & { sub: string };

  const [user] = await db.select().from(users).where(eq(users.id, decoded.sub));

  if (!user) {
    throw new HTTPException(401, { message: "User not found" });
  }

  await setCookies(user.id, c);

  c.status(200);

  return c.json({
    message: "Successfully refreshed",
  });
});

app.onError((err, c) => {
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

  if (err instanceof HTTPException) {
    c.status(err.status);
    return c.json({
      message: err.message,
    });
  }

  console.log(err);

  c.status(500);
  return c.json({
    message: "Internal server error",
  });
});

export default app;
