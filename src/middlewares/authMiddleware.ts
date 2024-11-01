import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      name: string;
    }
  }
}

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies["auth-token"];
  if (!token) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userId = (decoded as JwtPayload).userId;
    req.name = (decoded as JwtPayload).name;
    next();
  } catch (error) {
    res.status(401).json({ message: "unauthorized" });
    return;
  }
};

export default verifyToken;