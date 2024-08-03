import { CustomError } from "./custom-error";

export class MethodNotAllowedError extends CustomError {
  statusCode: number = 405;

  constructor(public message: string = "Method not allowed") {
    super(message);
    Object.setPrototypeOf(this, MethodNotAllowedError.prototype);
  }

  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: this.message }];
  }
}
