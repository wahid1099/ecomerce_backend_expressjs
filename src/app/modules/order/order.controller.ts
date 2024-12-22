import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { orderService } from "./order.service";
import httpStatus from "http-status";

const createOrder = catchAsync(async (req: Request, res: Response) => {
  // Call the correct order creation service
  const result = await orderService.createOrder(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order created successfully!",
    data: result,
  });
});

const getOrdersForUser = catchAsync(async (req: Request, res: Response) => {
  const result = await orderService.getOrdersForUser(req.user._id);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order fethced successfully!",
    data: result,
  });
});

const getOrdersForVendor = catchAsync(async (req: Request, res: Response) => {
  // const { shopId } = req.params;
  const result = await orderService.getOrdersForVendor(req.user.shop[0]);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Order fethced successfully!",
    data: result,
  });
});


const getAllOrdersForAdmin = catchAsync(async (req: Request, res: Response) => {

  const result = await orderService.getAllordersFromDB();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "All Order fethced successfully!",
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
  createOrder,getAllOrdersForAdmin
};
