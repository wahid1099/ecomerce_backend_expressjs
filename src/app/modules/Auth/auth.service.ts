import { jwtHelpers } from "../../../helpers/jwthelpers";
import { User } from "../user/user.model";
import * as bcrypt from "bcrypt";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import emailSender from "./emailSender";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

const loginUser = async (payload: { email: string; password: string }) => {
  const user = await User.findOne({ email: payload.email, isDeleted: false });

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials!");
  }
  // Check if the provided password matches the hashed password in the database

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials!");
  }
  // Generate JWT tokens

  const accessToken = jwtHelpers.generateToken(
    {
      ...user.toObject(), // Convert the Mongoose document to a plain object
      password: undefined, // Exclude sensitive data like the password
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );
  // Generate refresh tokens

  const refreshToken = jwtHelpers.generateToken(
    { email: user.email, role: user.role },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  // Update user's last login timestamp
  user.lastLoginAt = new Date(); // Set the current date and time
  await user.save(); // Save the updated user document
  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string) => {
  const decodedData = jwtHelpers.verifyToken(
    token,
    config.jwt.refresh_token_secret as Secret
  );

  if (!decodedData) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token!");
  }

  const user = await User.findOne({
    email: decodedData.email,
    isDeleted: false,
  });

  if (!user) {
    throw new ApiError(httpStatus.FORBIDDEN, "User not found!");
  }

  const accessToken = jwtHelpers.generateToken(
    { email: user.email, role: user.role },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return { accessToken };
};

const changePassword = async (
  user: { email: string },
  payload: { oldPassword: string; newPassword: string }
) => {
  const existingUser = await User.findOne({
    email: user.email,
    isDeleted: false,
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  const isPasswordValid = await bcrypt.compare(
    payload.oldPassword,
    existingUser.password
  );
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Old password is incorrect!");
  }

  existingUser.password = payload.newPassword; // Will be hashed automatically by pre-save hook
  await existingUser.save();

  return { message: "Password changed successfully!" };
};

const forgotPassword = async (payload: { email: string }) => {
  const user = await User.findOne({ email: payload.email, isDeleted: false });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  const resetPassToken = jwtHelpers.generateToken(
    { email: user.email, role: user.role },
    config.jwt.reset_pass_secret as Secret,
    config.jwt.reset_pass_token_expires_in as string
  );

  const resetPassLink = `${config.reset_pass_link}?userId=${user.id}&token=${resetPassToken}`;

  await emailSender(
    user.email,
    `
     <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
    <div style="background-color: #4f46e5; color: #ffffff; padding: 20px; text-align: center;">
      <h1 style="margin: 0; font-size: 24px;">Password Reset Request</h1>
    </div>
    <div style="padding: 20px;">
      <p style="margin: 0 0 10px;">Dear User,</p>
      <p style="margin: 0 0 20px;">We received a request to reset your password. You can reset it by clicking the button below:</p>
      <div style="text-align: center; margin: 20px 0;">
        <a href="${resetPassLink}" style="text-decoration: none; background-color: #4f46e5; color: #ffffff; padding: 12px 20px; border-radius: 5px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="margin: 0 0 10px;">If you didn't request this change, you can safely ignore this email. Your password will remain the same.</p>
      <p style="margin: 20px 0 0;">Best regards,</p>
      <p style="margin: 0;">BD SHOP Team</p>
    </div>
    <div style="background-color: #f3f4f6; color: #6b7280; padding: 10px 20px; text-align: center; font-size: 12px;">
      <p style="margin: 0;">© 2024 BD SHOP. All rights reserved.</p>
    </div>
  </div>
</div>

    `
  );

  return { message: "Password reset link sent to your email." };
};

const resetPassword = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const decodedData = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_pass_secret as Secret
  );

  if (!decodedData) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid reset password token!");
  }

  const user = await User.findOne({ _id: payload.id, isDeleted: false });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  user.password = payload.password; // Will be hashed automatically by pre-save hook
  await user.save();

  return { message: "Password reset successfully!" };
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
