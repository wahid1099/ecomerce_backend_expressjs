import ApiError from "../../errors/ApiErros";
import { Product } from "./product.model"; // Importing the Product model
import httpStatus from "http-status";

// Create a new product
const createProduct = async (payload: any) => {
  const product = await Product.create(payload);
  if (!product) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create product");
  }
  return product;
};
// Update product details
const updateProduct = async (productId: string, payload: any) => {
  const updatedProduct = await Product.findByIdAndUpdate(productId, payload, {
    new: true, // Return the updated document
    runValidators: true, // Validate before updating
  });
  if (!updatedProduct) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found to update");
  }
  return updatedProduct;
};

// Delete a product
const deleteProduct = async (productId: string) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  await Product.deleteOne({ _id: productId });
  return { message: "Product deleted successfully!" };
};

// Get all products for a vendor (assumed `vendorId` corresponds to `shopId`)
const getVendorProducts = async (shopID: string) => {
  const products = await Product.find({ shopId: shopID }).populate([
    "images",
    // "reviews",
    "orderItems",
  ]); // Populate related fields if needed
  if (!products || products.length === 0) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No products found for this vendor"
    );
  }
  return products;
};

// Get product details by ID
const getProductById = async (productId: string) => {
  const product = await Product.findById(productId)
    .populate("images reviews orderItems") // Populate related fields
    .orFail(); // Throws an error if not found
  return product;
};

// Remove image from the product
const removeImageFromProduct = async (productId: string, imageUrl: string) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { $pull: { images: imageUrl } }, // Remove the specific image
    { new: true, runValidators: true } // Return the updated product
  );
  if (!product) {
    throw new ApiError(httpStatus.NOT_FOUND, "Product not found");
  }
  return product;
};

const getAllProducts = async () => {
  const products = await Product.find().populate([
    "images",
    "reviews",
    "orderItems",
  ]); // You can populate other fields if necessary
  return products;
};
export const ProductService = {
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts,
  getProductById,
  removeImageFromProduct,
  getAllProducts,
};
