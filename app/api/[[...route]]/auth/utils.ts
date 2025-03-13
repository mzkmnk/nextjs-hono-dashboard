import { Context } from "hono";
import { setCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

export const createAccessToken = async (id: string): Promise<string> => {
  const jwtPayload: JWTPayload = {
    sub: id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60,
  };

  return await sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET!);
};

export const createRefreshToken = async (id: string): Promise<string> => {
  const jwtPayload: JWTPayload = {
    sub: id,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30,
  };

  return await sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET!);
};

export const setCookies = async (id: string, c: Context): Promise<void> => {
  const token = await createAccessToken(id);
  const refreshToken = await createRefreshToken(id);

  setCookie(c, "accessToken", token, {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
  });
  setCookie(c, "refreshToken", refreshToken, {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
  });
};
