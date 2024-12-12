import { Product } from "./product.model"; // Importing the Product model

// Create a new product
const createProduct = async (payload: any) => {
  const product = await Product.create(payload);
  return product;
};
// Update product details
const updateProduct = async (productId: string, payload: any) => {
  const updatedProduct = await Product.findByIdAndUpdate(productId, payload, {
    new: true, // Return the updated document
    runValidators: true, // Validate before updating
  });
  return updatedProduct;
};

// Delete a product
const deleteProduct = async (productId: string) => {
  await Product.findByIdAndDelete(productId);
  return { message: "Product deleted successfully!" };
};

// Get all products for a vendor (assumed `vendorId` corresponds to `shopId`)
const getVendorProducts = async (vendorId: string) => {
  const products = await Product.find({ shopId: vendorId }).populate([
    "images",
    "reviews",
    "orderItems",
  ]); // Populate related fields if needed
  return products;
};

// Get product details by ID
const getProductById = async (productId: string) => {
  const product = await Product.findById(productId)
    .populate("images reviews orderItems") // Populate related fields
    .orFail(); // Throws an error if not found
  return product;
};

export const ProductService = {
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorProducts,
  getProductById,
};
