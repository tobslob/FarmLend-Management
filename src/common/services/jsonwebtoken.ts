import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { config } from "dotenv";
import { Users } from "@app/services/user";
import { NotFoundError, handleError, NoAuthenticationError } from "@app/data/util";
import { UNAUTHORIZED } from "http-status-codes";
import { User } from "@app/data/user";

config();

/**
 * Generate token based on payload.
 */
export function seal(data: User, secret: string, ttl: number | string): Promise<string> {
  const expiresIn = typeof ttl === "number" ? `${ttl}s` : ttl;
  return new Promise((resolve, reject) => {
    const claim = data.toJSON ? data.toJSON() : data;
    jwt.sign({ claim }, secret, { expiresIn }, (err, sig) => {
      if (err) return reject(err);
      resolve(sig);
    });
  });
}

/**
 * Verifies user provided token
 */
export function unseal(token: string, secret: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, val) => {
      if (err) return reject(err);
      return resolve(val["claim"]);
    });
  });
}

export async function secure(req: Request, res: Response, next: NextFunction) {
  try {
    if(!req.headers.authorization) throw new NoAuthenticationError();
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return null;
    }

    const claim = await unseal(token, process.env.SECRET_KEY);

    const user = await Users.getUser(claim["id"]);

    if (!user) {
      throw new NotFoundError("User not found");
    }
    req["user"] = claim;
    return next();
  } catch (error) {
    return handleError(req, res, error.message, UNAUTHORIZED);
  }
}
