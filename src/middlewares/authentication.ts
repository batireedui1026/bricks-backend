import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../utils/jwt";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string | string[];
        role: string;
      };
    }
  }
}

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ message: "Та энэ үйдлийг хийхийн тулд нэвтэрнэ үү" });
  }
  // console.log("req ees irsen token", req.headers.authorization);
  const token = req.headers.authorization.split(" ")[1];
  // console.log("req ees irse zadalsan token", token);
  const user = decodeToken(token);
  req.user = user as any;
  next();
};
