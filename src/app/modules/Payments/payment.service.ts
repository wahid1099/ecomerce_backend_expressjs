import httpStatus from "http-status";
import ApiError from "../../errors/ApiError";
import { User } from "../user/user.model";
import { IPayment } from "./payment.interface";
import { Payment } from "./payment.model";

import {
  calculateExpiryDate,
  initiatePayment,
  verifyPayment,
} from "../../../helpers/PaymentGetway";
import { join } from "path";
import { readFileSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import { Order } from "../order/order.model";

const createPaymentIntoDB = async (payload: IPayment) => {
  if (!payload.user || !payload.amount || !payload.method) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Missing required payment fields!"
    );
  }

  // Check if the user exists
  const isUserExist = await User.findById(payload.user);
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found!");
  }

  // Generate a unique transaction ID
  const newTransactionId = uuidv4();

  const paymentData = {
    ...payload,
    transactionId: newTransactionId,
    userName: isUserExist.name,
    email: isUserExist.email,
    phoneNumber: isUserExist.phone || "N/A",
    address: isUserExist.addressBook || "Dhaka",
    amount: payload.amount,
  };

  try {
    // Initiate the payment session
    const paymentSession = await initiatePayment(paymentData);

    // Create a payment record in the database
    const newPayment = await Payment.create({
      order: payload.order,
      user: payload.user,
      amount: payload.amount,
      method: payload.method,
      status: "pending", // Default status until confirmed
      transactionId: newTransactionId,
    });

    return { paymentSession, newPayment };
  } catch (error) {
    console.error("Payment creation failed:", error);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create payment!"
    );
  }
};

const getAllPaymentIntoDB = async () => {
  const result = await Payment.find().populate("user");
  return result;
};

const getSinglePaymentIntoDB = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Payment Not Found!");
  }
  return payment;
};

const readTemplate = (filePath: string, message: string): string => {
  try {
    let template = readFileSync(filePath, "utf-8");
    return template.replace("{{message}}", message);
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Template reading failed."
    );
  }
};

const confirmationServiceIntoDB = async (
  transactionId?: string,
  status?: string,
  payloadData?: string
) => {
  let message = "";
  let parsedPaymentData;

  try {
    // Verify payment
    const res = await verifyPayment(transactionId);
    console.log(res);

    if (!res || res.pay_status !== "Successful") {
      throw new Error("Payment verification failed or was not successful.");
    }

    // Parse payment data
    try {
      parsedPaymentData =
        typeof payloadData === "string" ? JSON.parse(payloadData) : payloadData;
    } catch (error) {
      throw new Error("Invalid JSON format in payment data.");
    }

    // Validate parsed payment data
    const {
      user,
      amount,
      transactionId: parsedTransactionId,
      method,
    } = parsedPaymentData || {};
    if (!user || !amount || !parsedTransactionId || !method) {
      throw new Error("Missing required payment data fields.");
    }

    // Check if payment record exists
    const payment = await Payment.findOne({ transactionId });
    if (!payment) {
      throw new ApiError(httpStatus.NOT_FOUND, "Payment record not found!");
    }

    // Update user and return successful template
    if (res?.pay_status === "Successful") {
      await User.findByIdAndUpdate(
        user,
        { $push: { payments: payment._id } },
        { new: true }
      );
      message = "Payment successful";
      const filePath = join(__dirname, "../../../../public/confirmation.html");
      return readTemplate(filePath, message);
    } else {
      throw new Error("Payment validation failed.");
    }
  } catch (error) {
    message = "Payment failed";
    const filePath = join(__dirname, "../../../../public/faildpayment.html");
    return readTemplate(filePath, message);
  }
};

export const PaymentService = {
  createPaymentIntoDB,
  getAllPaymentIntoDB,
  getSinglePaymentIntoDB,
  confirmationServiceIntoDB,
};
