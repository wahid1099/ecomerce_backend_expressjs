"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const order_model_1 = require("./order.model");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const shop_model_1 = require("../shop/shop.model");
const payment_model_1 = require("../Payments/payment.model");
/**
 * Create a new order for a shop
 * @param params - userId, shopId, items, and totalAmount
 */
const createOrder = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.create(payload);
    const { user, shop } = payload;
    // Update the user's orders array
    if (user) {
        yield user_model_1.User.findByIdAndUpdate(user, { $push: { orders: order._id } }, // Add order ID to user's orders array
        { new: true });
    }
    // Update the shop's orders array
    if (shop) {
        yield shop_model_1.Shop.findByIdAndUpdate(shop, { $push: { orders: order._id } }, // Add order ID to shop's orders array
        { new: true });
    }
    return order;
});
/**
 * Get all orders for a specific user
 * @param userId - The user's ID
 */
const getOrdersForUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.Order.find({ user: userId })
        .populate("items.product") // Populate product details in order items
        .populate("shop"); // Populate shop details
    if (!orders || orders.length === 0) {
        throw new ApiError_1.default(http_status_1.default.OK, "No orders found for this user");
    }
    // Fetch payments for each order
    const orderIds = orders.map((order) => order._id);
    const payments = yield payment_model_1.Payment.find({ order: { $in: orderIds } });
    // Combine orders with their respective payments
    const ordersWithPayments = orders.map((order) => {
        const payment = payments.find((pay) => pay.order && pay.order.toString() === order._id.toString());
        return Object.assign(Object.assign({}, order.toObject()), { payment: payment || null });
    });
    return ordersWithPayments;
});
/**
 * Get all orders for a specific vendor/shop
 * @param shopId - The shop's ID
 */
const getOrdersForVendor = (shopId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch orders for the shop
    const orders = yield order_model_1.Order.find({ shop: shopId })
        .populate("items.product") // Populate product details in order items
        .populate("user") // Populate product details in order items
        .populate("shop"); // Populate shop details
    if (!orders || orders.length === 0) {
        throw new ApiError_1.default(http_status_1.default.OK, "No orders found for this shop");
    }
    // Fetch payments for each order
    const orderIds = orders.map((order) => order._id);
    const payments = yield payment_model_1.Payment.find({ order: { $in: orderIds } });
    // Combine orders with their respective payments
    const ordersWithPayments = orders.map((order) => {
        const payment = payments.find((pay) => pay.order && pay.order.toString() === order._id.toString());
        return Object.assign(Object.assign({}, order.toObject()), { payment: payment || null });
    });
    return ordersWithPayments;
});
/**
 * Update the status of an order
 * @param orderId - The order's ID
 * @param status - The new status: "pending", "completed", or "canceled"
 */
const updateOrderStatus = (orderId, status) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_model_1.Order.findById(orderId);
    if (!order) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Order not found");
    }
    order.status = status;
    yield order.save();
    return order;
});
const getAllordersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.Order.find().populate(["user", "shop"]).populate({
        path: "items.product", // Path to the product field in the items array
        model: "Product", // Name of the model to populate
    });
    // Extract order IDs
    const orderIds = orders.map((order) => order._id);
    // Fetch payments associated with the orders
    const payments = yield payment_model_1.Payment.find({ order: { $in: orderIds } });
    // Combine orders with their respective payments
    const ordersWithPayments = orders.map((order) => {
        const payment = payments.find((pay) => pay.order && pay.order.toString() === order._id.toString());
        return Object.assign(Object.assign({}, order.toObject()), { payment: payment ? payment.toObject() : null });
    });
    return ordersWithPayments;
});
exports.orderService = {
    createOrder,
    getOrdersForUser,
    getOrdersForVendor,
    updateOrderStatus,
    getAllordersFromDB,
};
