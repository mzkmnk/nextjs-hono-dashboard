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
