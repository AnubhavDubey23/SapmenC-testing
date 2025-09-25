import { NextFunction, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { AuthenticatedRequest } from './auth.middleware';
import { EPlanIds, EPlanNames } from '../data/PLANS_DATA';
import userModel from '../modules/user/user.model';
import { FREE_TIER_LIMITS } from '../data/LIMITS';

dotenv.config();

const { JWT_SECRET } = process.env;

export const checkPlan = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== 'undefined') {
    const token = authHeader.split(' ')[1];
    // here user contains only userId
    jwt.verify(token, JWT_SECRET!, async (err, user) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized',
          data: err.message,
        });
      }
      const userPayload: JwtPayload = user as JwtPayload;
      const userBody = await userModel.findById(userPayload.userId);

      const plan = userBody?.subscription.plan;

      switch (plan) {
        case EPlanNames.FREE:
          validateFreePlanFeatures(req, res, next);
          break;
        case EPlanNames.STARTER:
          validateStarterPlanFeatures(req, res, next);
          break;
        case EPlanNames.PRO:
          validateProPlanFeatures(req, res, next);
          break;
        //        case EPlanNames.ENTERPRISE:
        //          validateEnterprisePlanFeatures(req, res, next);
        //          break;
      }

      //      req.user = user;

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

export const validateFreePlanFeatures = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== 'undefined') {
    const token = authHeader.split(' ')[1];
    // here user contains only userId
    jwt.verify(token, JWT_SECRET!, async (err, user) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized',
          data: err.message,
        });
      }
      const userPayload: JwtPayload = user as JwtPayload;
      const userBody = await userModel.findById(userPayload.userId);

      //Free plan check
      if (userBody?.total_template_count === 3) {
        return res.status(429).json({
          status: false,
          message: 'Template limit reached for free plan',
          data: null,
        });
      }
      if (userBody?.total_imported_contacts_count === 3000) {
        return res.status(429).json({
          status: false,
          message: 'Contact import limit reached for free plan',
          data: null,
        });
      }

      //      req.user = user;
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

export const validateStarterPlanFeatures = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== 'undefined') {
    const token = authHeader.split(' ')[1];
    // here user contains only userId
    jwt.verify(token, JWT_SECRET!, async (err, user) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized',
          data: err.message,
        });
      }
      const userPayload: JwtPayload = user as JwtPayload;
      const userBody = await userModel.findById(userPayload.userId);

      //Starter plan check
      if (userBody?.total_imported_contacts_count === 10_000) {
        return res.status(429).json({
          status: false,
          message: 'Contact import limit reached for free plan',
          data: null,
        });
      }

      //      req.user = user;
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

export const validateProPlanFeatures = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== 'undefined') {
    const token = authHeader.split(' ')[1];
    // here user contains only userId
    jwt.verify(token, JWT_SECRET!, async (err, user) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized',
          data: err.message,
        });
      }

      //      req.user = user;
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

export const validateEnterprisePlanFeatures = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (typeof authHeader !== 'undefined') {
    const token = authHeader.split(' ')[1];
    // here user contains only userId
    jwt.verify(token, JWT_SECRET!, async (err, user) => {
      if (err) {
        return res.status(401).json({
          status: false,
          message: 'Unauthorized',
          data: err.message,
        });
      }

      //      req.user = user;
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

export const createTemplateMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { user } = req;
    // Later, add a migration for has made total templates reached

    // Not to exceed limit for user's on free plan
    if (
      user.subscription.plan === EPlanIds.FREE &&
      user.total_template_count >= FREE_TIER_LIMITS.maxTemplates
    ) {
      res.status(400).json({
        status: false,
        message: 'Limit reached for free plan',
        data: null,
      });
    } else {
      next();
    }
  } catch (err) {
    res.status(500).json({
      status: false,
      message: 'Internal Server error',
      data: null,
    });
  }
};
