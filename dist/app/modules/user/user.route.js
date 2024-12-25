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
// **Admin-Only Routes**
// Get all users
router.get("/", (0, Auth_1.default)(user_interface_1.UserRole.Admin), user_controller_1.UserController.getAllUsersfromDb);
// Create a new user
router.post("/create-user", (0, validaterequest_1.default)(user_validation_1.UserValidationSchema.UserSchemaCreate), user_controller_1.UserController.inserUserIntoDB);
// Suspend/Unsuspend a vendor
router.patch("/suspend-vendor/:vendorId", (0, Auth_1.default)(user_interface_1.UserRole.Admin), user_controller_1.UserController.suspendVendor);
// Delete a user
router.patch("/deactivate-user/:userId", (0, Auth_1.default)(user_interface_1.UserRole.Admin), user_controller_1.UserController.deleteUserfromDb);
// **Shared Routes (Admin, Customer, Vendor)**
// Get user profile
router.get("/me", (0, Auth_1.default)(user_interface_1.UserRole.Admin, user_interface_1.UserRole.Customer, user_interface_1.UserRole.Vendor), user_controller_1.UserController.getMyprofilefromDb);
// Update user profile
router.patch("/update-my-profile/:userId", (0, Auth_1.default)(user_interface_1.UserRole.Admin, user_interface_1.UserRole.Customer, user_interface_1.UserRole.Vendor), (0, validaterequest_1.default)(user_validation_1.UserValidationSchema.UserSchemaUpdate), user_controller_1.UserController.updateUserIntoDb);
// **Customer & Vendor Routes**
// Toggle follow shop
router.post("/toggle-followshop/:shopId", // Fixed typo in route: "fllowshop" -> "followshop"
(0, Auth_1.default)(user_interface_1.UserRole.Customer, user_interface_1.UserRole.Vendor), user_controller_1.UserController.toggleShopFollow);
// **Customer-Only Routes**
// Get followed shops
router.get("/followed-shops", (0, Auth_1.default)(user_interface_1.UserRole.Customer), user_controller_1.UserController.getUserFollowedShops);
exports.userRoutes = router;
