import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { orderService } from "./order.service";
import httpStatus from "http-status";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  const { userId, shopId, items, totalAmount } = req.body;

  // Call the correct order creation service
  const result = await orderService.createOrder({
    userId,
    shopId,
    items,
    totalAmount,
  });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created successfully!",
    data: result,
  });
});

const getOrdersForUser = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.user._id;
  const result = await orderService.getOrdersForUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order fethced successfully!",
    data: result,
  });
});

const getOrdersForVendor = catchAsync(async (req: Request, res: Response) => {
  const { shopId } = req.params;
  const result = await orderService.getOrdersForUser(shopId);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order fethced successfully!",
    data: result,
  });
});

const updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
  const { orderId, status } = req.body;
  const result = await orderService.updateOrderStatus(orderId, status);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order fethced successfully!",
    data: result,
  });
});

export const orderController = {
  updateOrderStatus,
  getOrdersForVendor,
  getOrdersForUser,
  createOrder,
};
