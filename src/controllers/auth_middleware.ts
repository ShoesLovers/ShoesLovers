import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (verified == null) return res.sendStatus(403);
  req.body._id = verified;
  next();
};
export default authenticateToken;
