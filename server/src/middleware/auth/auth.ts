import User from "../../models/user/user";
import AppError from "../../utils/appError";
import { verifyAccessToken } from "../../utils/token";
import catchAsync from "../../utils/catchAsync";

import { CustomRequest } from "../../types/shared";
import { NextFunction, Response } from "express";

export const authenticationMiddleware = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return next(
        new AppError("You are not logged in! please login to get access", 401)
      );
    }

    const accessToken: string = authHeader.split(" ")[1];

    try {
      const { userId } = verifyAccessToken(accessToken);

      const user = await User.findById(userId);

      if (!user) {
        return next(new AppError("No user found with this id", 400));
      }

      req.user = user;
      next();
    } catch {
      return next(new AppError("You are not logged in", 401));
    }
  }
);

// export const authenticationMiddleware = catchAsync(
//   async (req: CustomRequest, res: Response, next: NextFunction) => {
//     const cookies = req.cookies;
//     if (!cookies[Cookie.AccessToken]) {
//       return next(new AppError("You are not logged in", 401));
//     }

//     const accessToken: string = cookies[Cookie.AccessToken];

//     try {
//       const { userId } = verifyAccessToken(accessToken);

//       const user = await User.findById(userId);

//       if (!user) {
//         return next(new AppError("No user found with this id", 400));
//       }

//       req.user = user;
//       next();
//     } catch {
//       return next(new AppError("You are not logged in", 401));
//     }
//   }
// );

export const authorizationMiddleware = catchAsync(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user?.adminAccess) {
      return next(
        new AppError("You don't have permission to access this endpoint", 403)
      );
    }

    next();
  }
);
