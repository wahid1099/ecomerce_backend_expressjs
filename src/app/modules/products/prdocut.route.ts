import express from "express";
import { ProductController } from "./product.controller";
import Auth from "../../middlewares/Auth";
import validateRequest from "../../middlewares/validaterequest";
import { UserRole } from "../user/user.interface";
import { ProductValidationSchema } from "./product.validation";

const router = express.Router();

// Create a new product
router.post(
  "/",
  Auth(UserRole.Vendor),
  validateRequest(ProductValidationSchema.createProductSchema),
  ProductController.createProduct
);

// Update a product
router.patch(
  "/:productId",
  Auth(UserRole.Vendor),
  validateRequest(ProductValidationSchema.updateProductSchema),
  ProductController.updateProduct
);

// Delete a product
router.delete(
  "/:productId",
  Auth(UserRole.Vendor),
  ProductController.deleteProduct
);

// Get all products for the vendor
router.get("/", Auth(UserRole.Vendor), ProductController.getVendorProducts);

// Get details of a product
router.get(
  "/:productId",
  Auth(UserRole.Vendor),
  ProductController.getProductById
);

export const ProductRoutes = router;
