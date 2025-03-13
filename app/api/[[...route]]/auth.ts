import { db } from "@/db";
import { users, userSignUpSchema } from "@/db/schema";
import { Hono } from "hono";
import bcrypt from "bcryptjs";
import { z } from "zod";
import {eq } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';
import { sign } from 'hono/jwt'
import {JWTPayload} from "hono/dist/types/utils/jwt/types";
import {setCookie} from "hono/cookie";

const app = new Hono()
  .post("/sign-in", async (c) => {
    try {
      const result = userSignUpSchema.parse(await c.req.json());

      const { email, password } = result;

      const [user] = await db.select().from(users).where(eq(users.email, email));

      // not exist user
      if(!user){
        c.status(404);
        return c.json({
          message: "User not found",
        });
      }

      // password not match
      if(!await bcrypt.compare(password,user.password)){
        c.status(400);
        return c.json({
          message: "Password not match",
        });
      }

      const payload:JWTPayload = {
        sub: user.id,
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
      }

      const token = await sign(payload,'secretkey'); // todo 開発終わったら環境変数にする

      console.log('token',token);

      c.status(200);

      setCookie(c,'token',token);

      return c.json({
        message:'ok',
      })

    } catch (e) {
      console.error(e);
    }
  })
  .post("/sign-up", async (c) => {
  try {
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
