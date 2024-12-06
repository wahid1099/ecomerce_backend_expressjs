import { jwtHelpers } from "../../../helpers/jwthelpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import config from "../../../config";
import { Secret } from "jsonwebtoken";
import emailSender from "./emailSender";
import ApiError from "../../errors/ApiErros";
import httpStatus from "http-status";

const loginUser = async (payload: { email: string; password: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email, isDeleted: false },
  });

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials!");
  }

  const isPasswordValid = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid credentials!");
  }

  const accessToken = jwtHelpers.generateToken(
    { email: user.email, role: user.role },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    { email: user.email, role: user.role },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
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

  const user = await prisma.user.findUnique({
    where: { email: decodedData.email, isDeleted: false },
  });

  if (!user) {
    throw new ApiError(httpStatus.FORBIDDEN, "User not found!");
  }

  const accessToken = jwtHelpers.generateToken(
    { email: user.email, role: user.role },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return { accessToken, needPasswordChange: user.needPasswordChange };
};

const changePassword = async (
  user: { email: string },
  payload: { oldPassword: string; newPassword: string }
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: user.email, isDeleted: false },
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

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: { email: user.email },
    data: { password: hashedPassword, needPasswordChange: false },
  });

  return { message: "Password changed successfully!" };
};

const forgotPassword = async (payload: { email: string }) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email, isDeleted: false },
  });

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
      <div>
        <p>Dear User,</p>
        <p>Your password reset link:</p>
        <a href="${resetPassLink}">Reset Password</a>
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

  const user = await prisma.user.findUnique({
    where: { id: payload.id, isDeleted: false },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  const hashedPassword = await bcrypt.hash(payload.password, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return { message: "Password reset successfully!" };
};

export const AuthServices = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
