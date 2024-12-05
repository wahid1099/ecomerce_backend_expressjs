import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../../config";
import ApiError from "../errors/ApiErros";
import httpStatus from "http-status";
import catchAsync from "../../shared/catchAsync";
import { UserRole } from "../modules/user/user.interface";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload; // Add a `user` field to the `Request` object
    }
  }
}

const Auth = (...requiredRoles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!");
    }

    const token = authHeader.split("Bearer ")[1];

    try {
      const decoded = jwt.verify(
        token,
        config.jwt.jwt_secret as string
      ) as JwtPayload;

      // Check if the role is valid
      if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
        throw new ApiError(
          httpStatus.FORBIDDEN,
          "You do not have permission to access this route!"
        );
      }

      req.user = decoded; // Attach decoded token to the request
      next();
    } catch (error) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid or expired token!");
    }
  });
};

export default Auth;
