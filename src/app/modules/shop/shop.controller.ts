import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { ShopServices } from "./shop.service";
import httpStatus from "http-status";

const createShop = catchAsync(async (req: Request, res: Response) => {
  // console.log("createShop",req.body);

  const result = await ShopServices.createShop(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Shop created successfully!",
    data: result,
  });
});

const updateShop = catchAsync(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  const shopId = req.params.shopId;
  const result = await ShopServices.updateShop(shopId, vendorId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shop updated successfully!",
    data: result,
  });
});

const getSingleShopData = catchAsync(async (req: Request, res: Response) => {
  const shopId = req.params.shopId;
  const result = await ShopServices.getSingleShopFromDb(shopId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shop Fetched successfully!",
    data: result,
  });
});

const getVendorShops = catchAsync(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  const result = await ShopServices.getVendorShops(vendorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Vendor shops fetched successfully!",
    data: result,
  });
});

const deleteShop = catchAsync(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  const shopId = req.params.shopId;
  const result = await ShopServices.deleteShop(shopId, vendorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Shop deleted successfully!",
    data: result,
  });
});

const getShopOrderHistory = catchAsync(async (req: Request, res: Response) => {
  const vendorId = req.user?.id;
  const shopId = req.params.shopId;
  const result = await ShopServices.getShopOrderHistory(shopId, vendorId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order history fetched successfully!",
    data: result,
  });
});

const followShop = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id; // Assuming user ID is in the request
  const { shopId } = req.params;

  const result = await ShopServices.followShop(userId, shopId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order history fetched successfully!",
    data: result,
  });
});

const unfollowShop = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id; // Assuming user ID is in the request
  const { shopId } = req.params;

  const result = await ShopServices.unfollowShop(userId, shopId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order history fetched successfully!",
    data: result,
  });
});
const getShopFollowers = catchAsync(async (req: Request, res: Response) => {
  const { shopId } = req.params;

  const result = await ShopServices.getShopFollowers(shopId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Order history fetched successfully!",
    data: result,
  });
});

export const ShopController = {
  createShop,
  updateShop,
  getVendorShops,
  deleteShop,
  getShopOrderHistory,
  followShop,
  unfollowShop,
  getShopFollowers,
  getSingleShopData,
};
