import { Response } from "express";

type Pagination = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

const sendResponse = <T>(
  res: Response,
  jsonData: {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T | null;
    pagination?: Pagination | null;
  }
) => {
  const { statusCode, success, message, data, pagination } = jsonData;

  res.status(statusCode).json({
    success,
    status: statusCode,
    message,
    data: data || null,
    pagination: pagination || null,
  });
};

export default sendResponse;
