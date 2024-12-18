"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRoutes = void 0;
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("./product.controller");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const validaterequest_1 = __importDefault(require("../../middlewares/validaterequest"));
const user_interface_1 = require("../user/user.interface");
const product_validation_1 = require("./product.validation");
const router = express_1.default.Router();
// Create a new product
router.post("/", (0, Auth_1.default)(user_interface_1.UserRole.Vendor, user_interface_1.UserRole.Admin), (0, validaterequest_1.default)(product_validation_1.ProductValidationSchema.createProductSchema), product_controller_1.ProductController.createProductController);
// Get all products for the vendor
router.get("/vendor-products", (0, Auth_1.default)(user_interface_1.UserRole.Vendor), product_controller_1.ProductController.getVendorProducts);
// Browse products (public route)
router.get("/browseproducts", product_controller_1.ProductController.browseProducts);
// Get all products for the admin
router.get("/all-products-admin", (0, Auth_1.default)(user_interface_1.UserRole.Admin), product_controller_1.ProductController.getAllProductsForAdmin);
// Update a product
router.patch("/:productId", (0, Auth_1.default)(user_interface_1.UserRole.Vendor, user_interface_1.UserRole.Admin), (0, validaterequest_1.default)(product_validation_1.ProductValidationSchema.updateProductSchema), product_controller_1.ProductController.updateProduct);
// Delete a product
router.delete("/:productId", (0, Auth_1.default)(user_interface_1.UserRole.Vendor, user_interface_1.UserRole.Admin), product_controller_1.ProductController.deleteProduct);
// Get details of a single product (dynamic route moved to the bottom)
router.get("/:productId", product_controller_1.ProductController.getProductById);
exports.ProductRoutes = router;
