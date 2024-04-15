import express, { NextFunction } from "express";
import { ActionResponse } from "../types";

// Middleware để validate trường yêu cầu

function getRequiredFields<T>(obj: T): (keyof T)[] {
  const requiredFields: (keyof T)[] = [];

  for (const key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      requiredFields.push(key);
    }
  }

  return requiredFields;
}

const validateFieldPayload = <T = any>(
  req: express.Request<{}, {}, any>,
  res: ActionResponse,
  next: NextFunction
) => {
  const requiredFields: any[] = getRequiredFields(req.body);
  console.log("requiredFields", requiredFields);

  for (const field of requiredFields) {
    if (!(field in req.body)) {
      return res.status(400).json({
        success: false,
        message: `Trường ${String(field)} là bắt buộc.`,
        code: 400,
      });
    }
  }

  next();
};

export { validateFieldPayload };
