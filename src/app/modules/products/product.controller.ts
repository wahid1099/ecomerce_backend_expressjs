import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ProductService } from "./product.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiErros";

const createProductController = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductService.createProduct({
      ...req.body,
      vendorId: req.user?._id, // Ensure user ID is passed as vendorId
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Product created successfully!",
      data: result,
    });
  }
);

const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await ProductService.updateProduct(productId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully!",
    data: result,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await ProductService.deleteProduct(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const getVendorProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getVendorProducts(req.user?.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Products fetched successfully!",
    data: result,
  });
});

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await ProductService.getProductById(productId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product fetched successfully!",
    data: result,
  });
});

export const ProductController = {
  getProductById,
  getVendorProducts,
  deleteProduct,
  updateProduct,
  createProductController,
};
