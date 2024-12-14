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
  Auth(UserRole.Vendor, UserRole.Admin),
  validateRequest(ProductValidationSchema.createProductSchema),
  ProductController.createProductController
);

// Get all products for the vendor (specific route)
router.get(
  "/vendor-products",
  Auth(UserRole.Vendor),
  ProductController.getVendorProducts
);

// Get all products for the admin (specific route)
router.get(
  "/all-products-admin",
  Auth(UserRole.Admin),
  ProductController.getAllProductsForAdmin
);

// Get details of a product (specific route)
router.get(
  "/:productId",
  Auth(UserRole.Vendor),
  ProductController.getProductById
);

// Update a product (generic route)
router.patch(
  "/:productId",
  Auth(UserRole.Vendor, UserRole.Admin),
  validateRequest(ProductValidationSchema.updateProductSchema),
  ProductController.updateProduct
);

// Delete a product (generic route)
router.delete(
  "/:productId",
  Auth(UserRole.Vendor),
  ProductController.deleteProduct
);

export const ProductRoutes = router;
