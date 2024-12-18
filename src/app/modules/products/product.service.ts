import ApiError from "../../errors/ApiError";
import { Product } from "./product.model"; // Importing the Product model
import httpStatus from "http-status";

type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
};
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
  const products = await Product.find({ shop: shopID }).populate([
    "images",
    // "reviews",
    "orderItems",
  ]); // Populate related fields if needed

  return products;
};

// Get product details by ID
const getProductById = async (productId: string) => {
  const product = await Product.findById(productId).populate("shop");
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
  const products = await Product.find().populate(["images", "orderItems"]); // You can populate other fields if necessary
  return products;
};

const getPaginatedProducts = async (
  filters: any,
  paginationOptions: IOptionsResult
) => {
  const { skip, limit, sortBy, sortOrder } = paginationOptions;

  const query: any = {};

  // Example: Apply filters
  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.name) {
    query.name = { $regex: filters.name, $options: "i" }; // Case-insensitive search
  }

  // **3. Filter by price range**
  if (filters.minPrice || filters.maxPrice) {
    query.price = {
      ...(filters.minPrice ? { $gte: Number(filters.minPrice) } : {}),
      ...(filters.maxPrice ? { $lte: Number(filters.maxPrice) } : {}),
    };
  }

  const data = await Product.find(query)
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
    .skip(skip)
    .limit(limit);

  const totalItems = await Product.countDocuments(query);
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    totalItems,
    totalPages,
  };
};
export const ProductService = {
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts,
  getProductById,
  removeImageFromProduct,
  getAllProducts,
  getPaginatedProducts,
};
