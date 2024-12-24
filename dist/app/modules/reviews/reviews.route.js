"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_interface_1 = require("../user/user.interface");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const reivews_controller_1 = require("./reivews.controller");
const router = express_1.default.Router();
router.post("/create-review", (0, Auth_1.default)(user_interface_1.UserRole.Admin, user_interface_1.UserRole.Customer, user_interface_1.UserRole.Vendor), reivews_controller_1.ReivewController.createProductController);
router.get("/", (0, Auth_1.default)(user_interface_1.UserRole.Admin), reivews_controller_1.ReivewController.getAllReviews);
exports.ReviewRoute = router;
