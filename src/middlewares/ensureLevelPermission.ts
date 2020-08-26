import { Request, Response, NextFunction } from 'express';

import AppError from '../errors/AppError';

export const ensureMinimumLevelPermission = (requiredPermissionLevel: number) => (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const userLevel = request.user.authorization;
    if (userLevel < requiredPermissionLevel) {
      throw new AppError('User is not authorized to do this action');
    }
    return next();
  } catch (err) {
    throw new AppError('User is not authorized to do this action', 403);
  }
};

export const onlySameUserOrAdminCanDoThisAction = () => (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    console.log('alo');
    return next();
  } catch (err) {
    throw new AppError('User is not authorized to do this action', 403);
  }
};
