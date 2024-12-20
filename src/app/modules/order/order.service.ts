import { IOrder, IOrderItem } from "./order.interface";
import { Order } from "./order.model";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { Shop } from "../shop/shop.model";

/**
 * Create a new order for a shop
 * @param params - userId, shopId, items, and totalAmount
 */
const createOrder = async (payload: IOrder) => {
  const order = await Order.create(payload);
  const { user, shop } = payload;
  // Update the user's orders array
  if (user) {
    await User.findByIdAndUpdate(
      user,
      { $push: { orders: order._id } }, // Add order ID to user's orders array
      { new: true }
    );
  }

  // Update the shop's orders array
  if (shop) {
    await Shop.findByIdAndUpdate(
      shop,
      { $push: { orders: order._id } }, // Add order ID to shop's orders array
      { new: true }
    );
  }

  return order;
};

/**
 * Get all orders for a specific user
 * @param userId - The user's ID
 */
const getOrdersForUser = async (userId: string) => {
  const orders = await Order.find({ user: userId })
    .populate("items.product")
    .populate("shop")
    .populate("payment");

  if (!orders) {
    throw new ApiError(httpStatus.NOT_FOUND, "No orders found for this user");
  }

  return orders;
};

/**
 * Get all orders for a specific vendor/shop
 * @param shopId - The shop's ID
 */
const getOrdersForVendor = async (shopId: string) => {
  const orders = await Order.find({ shop: shopId })
    .populate("items.product")
    .populate("shop")
    .populate("payment");

  if (!orders) {
    throw new ApiError(httpStatus.NOT_FOUND, "No orders found for this shop");
  }

  return orders;
};

/**
 * Update the status of an order
 * @param orderId - The order's ID
 * @param status - The new status: "pending", "completed", or "canceled"
 */
const updateOrderStatus = async (
  orderId: string,
  status: "pending" | "completed" | "canceled"
) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(httpStatus.NOT_FOUND, "Order not found");
  }

  order.status = status;
  await order.save();

  return order;
};

export const orderService = {
  createOrder,
  getOrdersForUser,
  getOrdersForVendor,
  updateOrderStatus,
};
