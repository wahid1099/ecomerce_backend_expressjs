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
      zip: userData.zip || null,
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

const deleteUser = async (UserId: string) => {
  const user = await prisma.member.findUnique({
    where: { memberId: UserId },
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Not found");
  }
  const result = await prisma.member.delete({
    where: { memberId: UserId },
  });

  return result;
};

export const UserService = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
