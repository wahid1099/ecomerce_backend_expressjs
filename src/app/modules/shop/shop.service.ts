import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiErros";
import httpStatus from "http-status";

const createShop = async (
  vendorId: string,
  shopData: { name: string; logo?: string; description?: string }
) => {
  const shop = await prisma.shop.create({
    data: {
      ...shopData,
      ownerId: vendorId,
    },
  });
  return shop;
};

const updateShop = async (
  shopId: string,
  vendorId: string,
  shopData: { name?: string; logo?: string; description?: string }
) => {
  const shop = await prisma.shop.updateMany({
    where: {
      id: shopId,
      ownerId: vendorId,
    },
    data: shopData,
  });
  if (!shop.count) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Shop not found or you don't have permission to edit this shop."
    );
  }
  return shop;
};

const getVendorShops = async (vendorId: string) => {
  const shops = await prisma.shop.findMany({
    where: {
      ownerId: vendorId,
    },
  });
  return shops;
};

const deleteShop = async (shopId: string, vendorId: string) => {
  const deletedShop = await prisma.shop.deleteMany({
    where: {
      id: shopId,
      ownerId: vendorId,
    },
  });
  if (!deletedShop.count) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "Shop not found or you don't have permission to edit this shop."
    );
  }
  return deletedShop;
};

const getShopOrderHistory = async (shopId: string, vendorId: string) => {
  const orders = await prisma.order.findMany({
    where: {
      shopId,
      shop: { ownerId: vendorId },
    },
  });
  return orders;
};

const followShop = async (userId: string, shopId: string) => {
  // Check if shop exists
  const shop = await prisma.shop.findUniqueOrThrow({
    where: { id: shopId },
  });

  if (!shop.count) {
    throw new ApiError(httpStatus.NOT_FOUND, "Shop not found .");
  }

  // Add the shop to the user's followedShops
  await prisma.shopFollower.create({
    data: {
      userId,
      shopId,
    },
  });

  return {
    message: `You are now following the shop ${shop.name}.`,
  };
};

const unfollowShop = async (userId: string, shopId: string) => {
  // Check if the user is following the shop
  const followRecord = await prisma.shopFollower.findFirst({
    where: {
      userId,
      shopId,
    },
  });

  if (!followRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Shop not found .");
  }

  // Remove the follow relationship
  await prisma.shopFollower.delete({
    where: {
      id: followRecord.id,
    },
  });

  return {
    message: `You have unfollowed the shop.`,
  };
};

const getShopFollowers = async (shopId: string) => {
  const followers = await prisma.shopFollower.findMany({
    where: { shopId },
    include: {
      user: true, // Include user details
    },
  });

  return followers.map((follower: any) => ({
    id: follower.user.id,
    name: follower.user.name,
    email: follower.user.email,
    profileImage: follower.user.profileImage,
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
