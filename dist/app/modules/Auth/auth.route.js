"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const validaterequest_1 = __importDefault(require("../../middlewares/validaterequest"));
const auth_validation_1 = require("./auth.validation");
const Auth_1 = __importDefault(require("../../middlewares/Auth"));
const router = express_1.default.Router();
// Login Route
router.post("/login", (0, validaterequest_1.default)(auth_validation_1.AuthValidationSchema.loginSchema), auth_controller_1.AuthController.loginUser);
// Refresh Token Route
router.post("/refresh-token", auth_controller_1.AuthController.refreshToken // This requires the refresh token in the cookies
);
// Change Password Route
router.patch("/change-password", (0, Auth_1.default)(), // Middleware to authenticate user
(0, validaterequest_1.default)(auth_validation_1.AuthValidationSchema.changePasswordSchema), // Validate password payload
auth_controller_1.AuthController.changePassword);
// Forgot Password Route
router.post("/forgot-password", (0, validaterequest_1.default)(auth_validation_1.AuthValidationSchema.forgotPasswordSchema), // Validate email payload
auth_controller_1.AuthController.forgotPassword);
// Reset Password Route
router.patch("/reset-password", (0, validaterequest_1.default)(auth_validation_1.AuthValidationSchema.resetPasswordSchema), // Validate reset token and new password
auth_controller_1.AuthController.resetPassword);
exports.AuthRoutes = router;
