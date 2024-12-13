import { IUser, IUserUpdate } from "./user.interface";
import { User } from "./user.model";
import ApiError from "../../errors/ApiErros";
import httpStatus from "http-status";

const createUser = async (userData: IUser) => {
  const { email, username } = userData;

  // Check for duplicate email or username
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "User with this email or username already exists"
    );
  }

  // Create the user (password will be hashed by the pre-save hook)
  const newUser = new User(userData);

  const result = await newUser.save(); // Pre-save hook automatically hashes the password
  return result;
};

const updateUser = async (userId: string, payload: Partial<IUserUpdate>) => {
  const existingUser = await User.findById(userId);

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  Object.assign(existingUser, payload);
  await existingUser.save();

  return existingUser;
};

const getMyProfileService = async (email: string) => {
  const user = await User.findOne({ email, isDeleted: false })
    .populate({ path: "shops", options: { strictPopulate: false } }) // Handle missing shops gracefully
    .populate({ path: "orders", options: { strictPopulate: false } }) // Handle missing orders gracefully
    // .populate({ path: "reviews", options: { strictPopulate: false } }) // Handle missing reviews gracefully
    .populate({ path: "followedShops", options: { strictPopulate: false } }) // Handle missing followedShops gracefully
    .populate({ path: "shopFollowers", options: { strictPopulate: false } }); // Handle missing shopFollowers gracefully
  // .populate({ path: "payments", options: { strictPopulate: false } }); // Handle missing payments gracefully

  // Check if the user was found
  if (!user) {
    // Throw a custom error if user not found
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Return the user with populated data
  return user;
};

const getAllUsers = async () => {
  const users = await User.find()
    .populate({ path: "shops", options: { strictPopulate: false } }) // Handle missing shops gracefully
    .populate({ path: "orders", options: { strictPopulate: false } }) // Handle missing orders gracefully
    .populate({ path: "reviews", options: { strictPopulate: false } }) // Handle missing reviews gracefully
    .populate({ path: "followedShops", options: { strictPopulate: false } }) // Handle missing followedShops gracefully
    .populate({ path: "shopFollowers", options: { strictPopulate: false } }) // Handle missing shopFollowers gracefully
    .populate({ path: "payments", options: { strictPopulate: false } }); // Handle missing payments gracefully

  return users;
};

const deleteUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  user.isDeleted = true;
  await user.save();

  return user;
};

const suspendVendor = async (vendorId: string, isSuspended: boolean) => {
  // Check if the user exists and is a vendor
  const user = await User.findById(vendorId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vendor not found");
  }

  if (user.role !== "Vendor") {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is not a vendor");
  }

  user.isSuspended = isSuspended;
  await user.save();

  return user;
};

const getUserFollowedShops = async (userId: string) => {
  const user = await User.findById(userId).populate({
    path: "followedShops",
    populate: {
      path: "shop",
    },
  });

  if (!user || !user.followedShops) {
    return [];
  }

  return user.followedShops.map((record: any) => ({
    id: record.shop._id,
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
