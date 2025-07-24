import dotenv from "dotenv";
import jwt from "jsonwebtoken";
// import { NextFunction, Request, Response } from "express";
dotenv.config();
export interface UserPayload {
  id: string;
  role: string;
}
export const generateToken = (payload: object) => {
  return jwt.sign(payload, process.env.JWT_TOKEN_PASSWORD || "", {
    expiresIn: "1d",
  });
};

export const decodeToken = (token: string): UserPayload => {
  return jwt.verify(token, process.env.JWT_TOKEN_PASSWORD || "") as UserPayload;
};
