import { IOrder, IOrderItem } from "./order.interface";
import { Order } from "./order.model";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { Shop } from "../shop/shop.model";
import { Payment } from "../Payments/payment.model";

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
    .populate("items.product") // Populate product details in order items
    .populate("shop"); // Populate shop details

  if (!orders || orders.length === 0) {
    throw new ApiError(httpStatus.OK, "No orders found for this user");
  }

  // Fetch payments for each order
  const orderIds = orders.map((order) => order._id);
  const payments = await Payment.find({ order: { $in: orderIds } });

  // Combine orders with their respective payments
  const ordersWithPayments = orders.map((order) => {
    const payment = payments.find(
      (pay) => pay.order && pay.order.toString() === order._id.toString()
    );
    return { ...order.toObject(), payment: payment || null };
  });

  return ordersWithPayments;
};

/**
 * Get all orders for a specific vendor/shop
 * @param shopId - The shop's ID
 */
const getOrdersForVendor = async (shopId: string) => {
  // Fetch orders for the shop
  const orders = await Order.find({ shop: shopId })
    .populate("items.product") // Populate product details in order items
    .populate("shop"); // Populate shop details

  if (!orders || orders.length === 0) {
    throw new ApiError(httpStatus.OK, "No orders found for this shop");
  }

  // Fetch payments for each order
  const orderIds = orders.map((order) => order._id);
  const payments = await Payment.find({ order: { $in: orderIds } });

  // Combine orders with their respective payments
  const ordersWithPayments = orders.map((order) => {
    const payment = payments.find(
      (pay) => pay.order && pay.order.toString() === order._id.toString()
    );
    return { ...order.toObject(), payment: payment || null };
  });

  return ordersWithPayments;
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

const getAllordersFromDB = async () => {
  const result = await Order.find().populate("user", "shop");
  return result;
};

export const orderService = {
  createOrder,
  getOrdersForUser,
  getOrdersForVendor,
  updateOrderStatus,
  getAllordersFromDB,
};
