import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { ReviewService } from "./reviews.service";

const createReviewController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ReviewService.createReviewIntoDb(req.body);

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Review created successfully!",
      data: result,
    });
  }
);

const getAllReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ReviewService.getAllReviewsFromDb();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Review created successfully!",
    data: result,
  });
});
export const ReivewController = {
  createReviewController,
  getAllReviews,
};
