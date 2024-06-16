import express, { NextFunction, Response } from "express";
import { ActionResponse } from "../types";
import { decodeBearerToken } from "../utils";

export interface AuthenticatedRequest extends express.Request {
  userInfo?: { userId: string };
}

const ensureAdmin = async <T = any>(
  req: express.Request<{}, {}, any>,
  res: ActionResponse,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;
  const userInfo = await decodeBearerToken(authorizationHeader);
  if (userInfo?.role !== "admin") {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      code: 401,
    });
  } else {
    next();
  }
};

const ensureUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authorizationHeader = req.headers.authorization;
  const userInfo = await decodeBearerToken(authorizationHeader);
  if (!userInfo) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
      code: 401,
    });
  } else {
    // Add userInfo to the req object
    req.userInfo = userInfo;
    next();
  }
};

export { ensureAdmin, ensureUser };
