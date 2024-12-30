import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { ProductService } from "./product.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { paginationHelper } from "../../../helpers/paginationHelper";

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
  const { imagesToRemove, ...updateData } = req.body; // Destructure to get imagesToRemove and the rest of the data

  // Remove images if specified
  if (imagesToRemove && Array.isArray(imagesToRemove)) {
    for (const imageUrl of imagesToRemove) {
      await ProductService.removeImageFromProduct(productId, imageUrl); // Call your service to remove the image
    }
  }

  // Update the product with the rest of the data
  const updatedProduct = await ProductService.updateProduct(
    productId,
    updateData
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Product updated successfully!",
    data: updatedProduct,
  });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { productId } = req.params;
  const result = await ProductService.deleteProduct(productId);
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found for deletion");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: null,
  });
});

const getVendorProducts = catchAsync(async (req: Request, res: Response) => {
  const result = await ProductService.getVendorProducts(req.user?.shop);

  const message =
    result && result.length > 0
      ? "Products fetched successfully!"
      : "No products found for this vendor";

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: message,
    data: result || [],
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

const getAllProductsForAdmin = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ProductService.getAllProducts();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All products fetched successfully for Admin!",
      data: result,
    });
  }
);

const browseProducts = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;
  const paginationOptions = paginationHelper.calculatePagination(req.query);
  const { data, totalItems, totalPages } =
    await ProductService.getPaginatedProducts(filters, paginationOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All products fetched successfully for user!",
    data: data,
    pagination: {
      totalItems,
      totalPages,
      currentPage: paginationOptions.page,
      pageSize: paginationOptions.limit,
    },
  });
});

export const ProductController = {
  getProductById,
  getVendorProducts,
  deleteProduct,
  updateProduct,
  createProductController,
  getAllProductsForAdmin,
  browseProducts,
};
