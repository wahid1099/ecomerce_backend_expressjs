import { IUser, IUserUpdate } from "./user.interface";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErros";
import httpStatus from "http-status";
import bcrypt from "bcrypt";

const createUser = async (userData: IUser) => {
  const { name, email, username, password, role } = userData;
  if (!name || !email || !username || !password || !role) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Missing required fields");
  }

  // Check for duplicate email or username
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (existingUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "User with this email or username already exists"
    );
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      username,
      password: hashedPassword,
      role,
      city: userData.city || null,
      state: userData.state || null,
      zip: userData.zipCode || null,
      country: userData.country || null,
      phone: userData.phone || null,
    },
  });

  return newUser;
};

const updateUser = async (UserId: string, payload: Partial<IUserUpdate>) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: UserId,
    },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: UserId,
    },
    data: payload,
  });

  return updatedUser;
};

const getMyProfileService = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
    include: {
      shops: true,
      orders: true,
      reviews: true,
      followedShops: true,
      shopFollowers: true,
      payments: true,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  return user;
};

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    include: {
      shops: true,
      orders: true,
      reviews: true,
      followedShops: true,
      shopFollowers: true,
      payments: true,
    },
  });

  return users;
};

const deleteUser = async (userId: string) => {
  const userExists = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!userExists) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { isDeleted: true },
  });

  return updatedUser;
};

const suspendVendor = async (vendorId: string, isSuspended: boolean) => {
  // Check if the user exists and is a vendor
  const user = await prisma.user.findUnique({
    where: { id: vendorId },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vendor not found");
  }

  if (user.role !== "vendor") {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is not a vendor");
  }

  // Update the `isSuspended` status
  const updatedUser = await prisma.user.update({
    where: { id: vendorId },
    data: { isSuspended },
  });

  return updatedUser;
};

const getUserFollowedShops = async (userId: string) => {
  const followedShops = await prisma.shopFollower.findMany({
    where: { userId },
    include: {
      shop: true, // Include shop details
    },
  });

  return followedShops.map((record: any) => ({
    id: record.shop.id,
    name: record.shop.name,
    description: record.shop.description,
  }));
};

export const UserService = {
  createUser,
  getAllUsers,
  getMyProfileService,
  updateUser,
  deleteUser,
  suspendVendor,
  getUserFollowedShops,
};
