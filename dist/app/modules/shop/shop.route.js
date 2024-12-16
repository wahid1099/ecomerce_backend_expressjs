"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopRoutes = void 0;
const express_1 = __importDefault(require("express"));
const shop_controller_1 = require("./shop.controller");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const user_interface_1 = require("../../modules/user/user.interface");
const validaterequest_1 = __importDefault(require("../../middlewares/validaterequest"));
const shop_validation_1 = require("./shop.validation");
const router = express_1.default.Router();
// Create a new shop
router.post("/", (0, Auth_1.default)(user_interface_1.UserRole.Vendor), (0, validaterequest_1.default)(shop_validation_1.ShopValidationSchema.createShopSchema), shop_controller_1.ShopController.createShop);
// Get all shops for the vendor
router.get("/", (0, Auth_1.default)(user_interface_1.UserRole.Admin), shop_controller_1.ShopController.getVendorShops);
// Get shop followers
router.get("/:shopId/followers", (0, Auth_1.default)(user_interface_1.UserRole.Admin, user_interface_1.UserRole.Vendor), shop_controller_1.ShopController.getShopFollowers);
// Get order history for a shop
router.get("/:shopId/orders", (0, Auth_1.default)(user_interface_1.UserRole.Vendor), shop_controller_1.ShopController.getShopOrderHistory);
// Update shop details
router.patch("/:shopId", (0, Auth_1.default)(user_interface_1.UserRole.Vendor), (0, validaterequest_1.default)(shop_validation_1.ShopValidationSchema.updateShopSchema), shop_controller_1.ShopController.updateShop);
// Follow a shop
router.post("/:shopId/follow", (0, Auth_1.default)(user_interface_1.UserRole.Customer, user_interface_1.UserRole.Vendor), shop_controller_1.ShopController.followShop);
// Unfollow a shop
router.post("/:shopId/unfollow", (0, Auth_1.default)(user_interface_1.UserRole.Customer, user_interface_1.UserRole.Vendor), shop_controller_1.ShopController.unfollowShop);
// Delete a shop
router.delete("/:shopId", (0, Auth_1.default)(user_interface_1.UserRole.Vendor), shop_controller_1.ShopController.deleteShop);
exports.ShopRoutes = router;
