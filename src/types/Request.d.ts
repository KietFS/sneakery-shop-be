import express from "epress";

export interface AuthenticatedRequest extends express.Request {
  userInfo?: { userId: string };
}
