import { UserService } from "./user.service";
import { Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import ApiError from "../../errors/ApiErros";

const inserUserIntoDB = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User created successfully",
    data: result,
  });
});

const getAllUsersfromDb = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllUsers();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

const getMyprofilefromDb = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await UserService.getMyProfileService(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateUserIntoDb = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await UserService.updateUser(userId, req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User updated successfully",
    data: result,
  });
});

const deleteUserfromDb = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await UserService.deleteUser(userId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User successfully deleted",
  });
};

const suspendVendor = catchAsync(async (req: Request, res: Response) => {
  const { vendorId } = req.params;
  const { isSuspended } = req.body;

  // Validate that `isSuspended` is provided and is a boolean
  if (typeof isSuspended !== "boolean") {
    throw new ApiError(httpStatus.BAD_REQUEST, "isSuspended must be a boolean");
  }

  const result = await UserService.suspendVendor(vendorId, isSuspended);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: `Vendor ${isSuspended ? "suspended" : "unsuspended"} successfully`,
    data: result,
  });
});

const getUserFollowedShops = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id; // Assuming user ID is in the request

  const result = await UserService.getUserFollowedShops(userId);

  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
});

export const UserController = {
  inserUserIntoDB,
  getAllUsersfromDb,
  getMyprofilefromDb,
  updateUserIntoDb,
  deleteUserfromDb,
  suspendVendor,
  getUserFollowedShops,
};
