import { Product } from "./product.model"; // Importing the Product model
import { ProductImage } from "./product.model"; // Importing ProductImage if needed for image management
import mongoose from "mongoose";

// Create a new product
const createProductWithImages = async (
  productPayload: any,
  imagePayloads: any[]
) => {
  // Start a transaction to ensure atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 1: Create the product
    const product = await Product.create([productPayload], { session });

    // Step 2: Add product images
    const productImages = imagePayloads.map((image) => ({
      ...image,
      productId: product[0]._id,
    }));
    const images = await ProductImage.insertMany(productImages, { session });

    // Step 3: Update the product with the associated images
    product[0].images = images.map((img) => img._id);
    await product[0].save({ session });

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return { product: product[0], images };
  } catch (error) {
    // Rollback the transaction in case of error
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
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
  createProductWithImages,
  updateProduct,
  deleteProduct,
  getVendorProducts,
  getProductById,
};
