import { IOrder, IOrderItem } from "./order.interface";

import { Schema, model } from "mongoose";

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  {
    timestamps: false, // No need for timestamps on individual items
    _id: true, // Each order item has its own ID
  }
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      required: true,
    },
    items: [{ type: OrderItemSchema, required: false }], // Embedded array of order items
    payment: { type: Schema.Types.ObjectId, ref: "Payment", required: false },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

// Create models
export const Order = model<IOrder>("Order", OrderSchema);
export const OrderItem = model<IOrderItem>("OrderItem", OrderItemSchema);