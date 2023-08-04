import { Request, Response, NextFunction } from "express";
import { CustomError } from "../../types/shared";

const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const defaultError = {
    statusCode: err.statusCode || 500,
    message: err.message || "Something went wrong! Try again later",
  };

  if (err.name === "JsonWebTokenError") {
    defaultError.statusCode = 401;
    defaultError.message = "Invalid token! Please try again later";
  }

  if (err.name === "TokenExpiredError") {
    defaultError.statusCode = 401;
    defaultError.message = "Your token has expired, Please log in againr";
  }

  res.status(defaultError.statusCode).json({
    status: "fail",
    message: defaultError.message,
  });
};

export default errorHandler;
