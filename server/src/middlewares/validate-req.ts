import { Response, NextFunction, Request } from "express";
import { AnyZodObject, ZodError } from "zod";
import { InternalServerError } from "../errors/internal-server-error";
import { ReqValidationError } from "../errors/req-validation-error";

export const validateReq =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      if (e instanceof ZodError) {
        throw new ReqValidationError(e);
      }

      throw new InternalServerError();
    }
  };
