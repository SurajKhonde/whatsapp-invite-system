export class AppError extends Error {
  statusCode: number;
 notify: boolean;
  constructor(message: string, statusCode: number, notify = true) {
    super(message);
    this.statusCode = statusCode;
    this.notify = notify;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}