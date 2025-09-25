import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export const checkRole = (role: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // if (req.body?.role !== role) {
    //     return res.status(403).send({ error: "Access Denied" });
    // }
    next();
  };
};
