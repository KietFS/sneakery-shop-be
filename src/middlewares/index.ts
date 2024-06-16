import express, { NextFunction } from "express";
import { ActionResponse } from "../types";
import { decodeBearerToken } from "../utils";

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

const ensureUser = async <T = any>(
  req: express.Request,
  res: ActionResponse,
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
    // Lưu thông tin người dùng vào req.user để các middleware/handler tiếp theo có thể sử dụng
    (req as any).userInfo = userInfo;
    next();
  }
};

export { ensureAdmin, ensureUser };
