import { CustomError } from "../types/shared";

class AppError extends Error implements CustomError {
  statusCode;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default AppError;
