import { IUser, IUserUpdate } from "./user.interface";
import { User } from "./user.model";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { Shop } from "../shop/shop.model";
import mongoose from "mongoose";

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
    .populate({
      path: "shop",
      options: { strictPopulate: false }, // Handle missing shops gracefully
      populate: {
        path: "shopFollowers", // Populate followers of the shop
        model: "User", // Reference to the User model
        select: "name email", // Fetch only specific fields if needed
        options: { strictPopulate: false }, // Handle missing followers gracefully
      },
    })
    .populate({
      path: "orders",
      options: { strictPopulate: false }, // Handle missing orders gracefully
      populate: {
        path: "items.product", // Path to the product field in the items array
        model: "Product", // Name of the model to populate
        options: { strictPopulate: false }, // Handle missing products gracefully
      },
    })
    .populate({ path: "reviews", options: { strictPopulate: false } }) // Handle missing reviews gracefully
    .populate({ path: "payments", options: { strictPopulate: false } }); // Handle missing reviews gracefully

  if (!user) {
    // Throw a custom error if user not found
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // Return the user with populated data
  return user;
};

const getAllUsers = async () => {
  const users = await User.find()
    .populate({ path: "shop", options: { strictPopulate: false } }) // Handle missing shops gracefully
    .populate({ path: "orders", options: { strictPopulate: false } }); // Handle missing orders gracefully
  // .populate({ path: "reviews", options: { strictPopulate: false } }) // Handle missing reviews gracefully

  // .populate({ path: "payments", options: { strictPopulate: false } }); // Handle missing payments gracefully

  return users;
};

const toggleUserDeletion = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  // If the user is already deleted, restore them by setting isDeleted to false.
  if (user.isDeleted) {
    user.isDeleted = false;
    await user.save();
    return user;
  }

  // If the user is not deleted, mark them as deleted.
  user.isDeleted = true;
  await user.save();

  return user;
};

const suspendVendor = async (vendorId: string) => {
  // Check if the user exists and is a vendor
  const user = await User.findById(vendorId);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Vendor not found");
  }

  if (user.role !== "Vendor") {
    throw new ApiError(httpStatus.BAD_REQUEST, "User is not a vendor");
  }

  // Toggle the `isSuspended` status
  if (user.isSuspended) {
    user.isSuspended = false; // Unsuspend the vendor
  } else {
    user.isSuspended = true; // Suspend the vendor
  }

  await user.save();

  return user;
};

const getUserFollowedShops = async (userId: string) => {
  const user = await User.findById(userId).populate({
    path: "followedShops", // Populate the array of ShopFollower references
    populate: {
      path: "shop", // Populate the shop field inside each ShopFollower
      select: "name description", // Optional: you can specify which fields to select from the Shop model
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

const followShopToggle = async (userId: string, shopId: string) => {
  // Convert string IDs to ObjectId
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const shopObjectId = new mongoose.Types.ObjectId(shopId);

  // Fetch user and shop documents
  const user = await User.findById(userObjectId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const shop = await Shop.findById(shopObjectId);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, "Shop not found");
  }

  // Check if the user already follows the shop
  const isUserFollowingShop = user.followedShops?.some(
    (id) => id.toString() === shopObjectId.toString()
  );
  const isShopFollowedByUser = shop.followers?.some(
    (id) => id.toString() === userObjectId.toString()
  );

  // Data consistency validation
  if (isUserFollowingShop !== isShopFollowedByUser) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Data inconsistency detected between user and shop"
    );
  }

  if (isUserFollowingShop) {
    // Unfollow the shop
    user.followedShops = user.followedShops?.filter(
      (id) => id.toString() !== shopObjectId.toString()
    );
    shop.followers = shop.followers?.filter(
      (id) => id.toString() !== userObjectId.toString()
    );
  } else {
    // Follow the shop
    user.followedShops = user.followedShops || [];
    shop.followers = shop.followers || [];
    user.followedShops.push(shopObjectId);
    shop.followers.push(userObjectId);
  }

  // Save changes
  await user.save();
  await shop.save();

  return {
    isFollowed: !isUserFollowingShop,
    user,
    shop,
  };
};

export const UserService = {
  createUser,
  getAllUsers,
  getMyProfileService,
  updateUser,
  toggleUserDeletion,
  suspendVendor,
  getUserFollowedShops,
  followShopToggle,
};
