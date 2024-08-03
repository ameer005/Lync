import { CustomError } from "./custom-error";

export class NotAuthenticatedError extends CustomError {
  statusCode: number = 401;

  constructor(
    public message: string = "Please log in to access this resource.",
  ) {
    super(message);
    Object.setPrototypeOf(this, NotAuthenticatedError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: this.message }];
  }
}
