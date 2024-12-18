class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message = "An error occurred", stack = "") {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
