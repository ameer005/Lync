import { Response, NextFunction } from "express";
import { CustomRequest } from "../types/shared";

type WrapperFunc = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => Promise<void>;

const catchAsync = (fn: WrapperFunc) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
