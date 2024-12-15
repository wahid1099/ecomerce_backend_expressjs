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

// Get all products for the vendor
router.get(
  "/vendor-products",
  Auth(UserRole.Vendor),
  ProductController.getVendorProducts
);

// Browse products (public route)
router.get("/browseproducts", ProductController.browseProducts);

// Get all products for the admin
router.get(
  "/all-products-admin",
  Auth(UserRole.Admin),
  ProductController.getAllProductsForAdmin
);

// Update a product
router.patch(
  "/:productId",
  Auth(UserRole.Vendor, UserRole.Admin),
  validateRequest(ProductValidationSchema.updateProductSchema),
  ProductController.updateProduct
);

// Delete a product
router.delete(
  "/:productId",
  Auth(UserRole.Vendor, UserRole.Admin),
  ProductController.deleteProduct
);

// Get details of a single product (dynamic route moved to the bottom)
router.get(
  "/:productId",
  Auth(UserRole.Vendor),
  ProductController.getProductById
);

export const ProductRoutes = router;
