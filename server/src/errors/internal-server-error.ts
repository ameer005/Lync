import { CustomError } from "./custom-error";

export class InternalServerError extends CustomError {
  statusCode: number = 500;

  constructor(public message: string = "InternalServerError") {
    super(message);
    Object.setPrototypeOf(this, InternalServerError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: this.message }];
  }
}
