import { Shop, ShopFollower } from "./shop.model";
import { Order } from "../order/order.model";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { IUser } from "../user/user.interface"; // Assuming you have IUser interface

const createShop = async (shopData: {
  name: string;
  logo?: string;
  description?: string;
  vendorId: string;
}) => {
  const shop = await Shop.create({
    ...shopData, // Spread the shopData object to include name, logo, description, and vendorId
  });

  return shop;
};

const updateShop = async (
  shopId: string,
  vendorId: string,
  shopData: { name?: string; logo?: string; description?: string }
) => {
  const shop = await Shop.findOneAndUpdate(
    { _id: shopId, vendorId },
    shopData,
    { new: true }
  );
  if (!shop) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Shop not found or you don't have permission to edit this shop."
    );
  }
  return shop;
};

const getVendorShops = async (vendorId: string) => {
  const shops = await Shop.find({ vendorId });
  return shops;
};

const deleteShop = async (shopId: string, vendorId: string) => {
  const shop = await Shop.findOneAndDelete({ _id: shopId, vendorId });
  if (!shop) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Shop not found or you don't have permission to delete this shop."
    );
  }
  return shop;
};

const getShopOrderHistory = async (shopId: string, vendorId: string) => {
  const orders = await Order.find({ shopId, vendorId });
  return orders;
};

const followShop = async (userId: string, shopId: string) => {
  // Check if shop exists
  const shop = await Shop.findById(shopId);
  if (!shop) {
    throw new ApiError(httpStatus.NOT_FOUND, "Shop not found.");
  }

  // Check if already following
  const isAlreadyFollowing = await ShopFollower.findOne({ userId, shopId });
  if (isAlreadyFollowing) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Already following this shop.");
  }

  // Add the shop to the user's followedShops
  await ShopFollower.create({ userId, shopId });

  return {
    message: `You are now following the shop ${shop.name}.`,
  };
};

const unfollowShop = async (userId: string, shopId: string) => {
  // Check if the user is following the shop
  const followRecord = await ShopFollower.findOne({ userId, shopId });
  if (!followRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Shop not found.");
  }

  // Remove the follow relationship
  await ShopFollower.findByIdAndDelete(followRecord._id);

  return {
    message: `You have unfollowed the shop.`,
  };
};

const getShopFollowers = async (shopId: string) => {
  const followers = await ShopFollower.find({ shop: shopId })
    .populate<{ user: IUser }>("user") // Explicitly set the type of 'user' to IUser
    .exec(); // Adding exec() ensures it's properly executed

  return followers.map((follower) => ({
    id: follower.user?._id,
    name: follower.user?.name,
    email: follower.user?.email,
    profileImage: follower.user?.profileImage,
  }));
};

export const ShopServices = {
  createShop,
  updateShop,
  getVendorShops,
  deleteShop,
  getShopOrderHistory,
  followShop,
  unfollowShop,
  getShopFollowers,
};
