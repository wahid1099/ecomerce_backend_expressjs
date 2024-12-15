import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default status code to 500 if not provided
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong!",
    error: {
      statusCode,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Include stack trace in development mode
    },
  });
};

export default globalErrorHandler;
