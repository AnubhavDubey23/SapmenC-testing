import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import userModel, { IUser } from '../modules/user/user.model';

dotenv.config();

const { JWT_SECRET } = process.env;

export interface AuthenticatedRequest extends Request {
  user: IUser;
}

export const validateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== 'undefined') {
    const token = authHeader.split(' ')[1];
    // here user contains only userId
    jwt.verify(token, JWT_SECRET!, async (err, jwtBody) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized',
          data: err.message,
        });
      }

      const payload = jwtBody as JwtPayload;

      const existingUser = await userModel.findById(payload.userId);

      if (!existingUser) {
        return res.status(404).json({
          status: false,
          message: 'User not found',
          data: null,
        });
      }

      req.user = existingUser;
      next();
    });
  } else {
    res.status(403).json({
      status: false,
      message: 'Forbidden',
      data: null,
    });
  }
};
