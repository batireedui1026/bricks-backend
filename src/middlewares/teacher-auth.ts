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

export const teacherAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ message: "Та энэ үйдлийг хийхийн тулд нэвтэрнэ үү" });
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = decodeToken(token);
    console.log(user);
    if (user.role !== "teacher") {
      return res.status(403).json({ message: "Forbidden: Teacher only" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
