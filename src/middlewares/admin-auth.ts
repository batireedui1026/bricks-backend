import { Request, Response, NextFunction } from "express";
import { decodeToken } from "../utils/jwt";

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

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res
      .status(401)
      .json({ message: "Та энэ үйдлийг хийхийн тулд нэвтэрнэ үү" });
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = decodeToken(token);

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin only" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
