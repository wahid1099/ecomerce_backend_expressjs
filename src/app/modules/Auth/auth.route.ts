import express from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validaterequest";
import { AuthValidationSchema } from "./auth.validation";
import Auth from "../../middlewares/Auth";

const router = express.Router();

// Login Route
router.post(
  "/login",
  validateRequest(AuthValidationSchema.loginSchema),
  AuthController.loginUser
);

// Refresh Token Route
router.post(
  "/refresh-token",
  AuthController.refreshToken // This requires the refresh token in the cookies
);

// Change Password Route
router.patch(
  "/change-password",
  Auth(), // Middleware to authenticate user
  validateRequest(AuthValidationSchema.changePasswordSchema), // Validate password payload
  AuthController.changePassword
);

// Forgot Password Route
router.post(
  "/forgot-password",
  validateRequest(AuthValidationSchema.forgotPasswordSchema), // Validate email payload
  AuthController.forgotPassword
);

// Reset Password Route
router.patch(
  "/reset-password",
  validateRequest(AuthValidationSchema.resetPasswordSchema), // Validate reset token and new password
  AuthController.resetPassword
);

export const AuthRoutes = router;
