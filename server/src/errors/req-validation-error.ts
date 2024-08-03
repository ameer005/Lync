import { ZodError } from "zod";
import { CustomError } from "./custom-error";

export class ReqValidationError extends CustomError {
  statusCode: number = 400;

  constructor(public errors: ZodError) {
    super("Invalid request parameters");
    Object.setPrototypeOf(this, ReqValidationError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return this.errors.errors.map((err) => {
      return { message: err.message, statusCode: this.statusCode };
    });
  }
}
