"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const user_interface_1 = require("./user.interface");
const user_validation_1 = require("./user.validation");
const validaterequest_1 = __importDefault(require("../../middlewares/validaterequest"));
const router = express_1.default.Router();
// Get all users (only for Admin)
router.get("/", (0, Auth_1.default)(user_interface_1.UserRole.Admin), user_controller_1.UserController.getAllUsersfromDb);
// Create a new user (Admin only)
router.post("/create-user", (0, validaterequest_1.default)(user_validation_1.UserValidationSchema.UserSchemaCreate), user_controller_1.UserController.inserUserIntoDB);
router.post("/toggle-fllowshop", (0, Auth_1.default)(user_interface_1.UserRole.Customer, user_interface_1.UserRole.Vendor), user_controller_1.UserController.toggleShopFollow);
// Get user profile (Admin, Customer, or Vendor)
router.get("/me", (0, Auth_1.default)(user_interface_1.UserRole.Admin, user_interface_1.UserRole.Customer, user_interface_1.UserRole.Vendor), user_controller_1.UserController.getMyprofilefromDb);
// Get followed shops (only for Customers)
router.get("/followed-shops", (0, Auth_1.default)(user_interface_1.UserRole.Customer), user_controller_1.UserController.getUserFollowedShops);
// Update user profile (Admin, Customer, or Vendor)
router.patch("/update-my-profile/:userId", (0, Auth_1.default)(user_interface_1.UserRole.Admin, user_interface_1.UserRole.Customer, user_interface_1.UserRole.Vendor), (0, validaterequest_1.default)(user_validation_1.UserValidationSchema.UserSchemaUpdate), user_controller_1.UserController.updateUserIntoDb);
// Suspend/Unsuspend a vendor (only for Admin)
router.patch("/suspend-vendor/:vendorId", (0, Auth_1.default)(user_interface_1.UserRole.Admin), user_controller_1.UserController.suspendVendor);
// Delete a user (only for Admin)
router.patch("/deactivate-user/:userId", // Fixed the route here by adding the missing "/"
(0, Auth_1.default)(user_interface_1.UserRole.Admin), user_controller_1.UserController.deleteUserfromDb);
exports.userRoutes = router;
