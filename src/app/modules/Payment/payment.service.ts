import httpStatus from "http-status";
import ApiError from "../../errors/ApiErros";
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

const createPaymentIntoDB = async (payload: IPayment) => {
  const isUserExist = await User.findById(payload.user);

  const newTransactionId = uuidv4();

  if (isUserExist && newTransactionId) {
    const paymentData = {
      ...payload,
      transactionId: newTransactionId,
      userName: isUserExist?.name,
      email: isUserExist?.email,
      phoneNumber: isUserExist?.phone,
      address: isUserExist?.addressBook || "Dhaka",
    };
    const paymentSession = await initiatePayment(paymentData);

    return paymentSession;
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

const confirmationServiceIntoDB = async (
  transactionId?: string | undefined,
  status?: string,
  payloadData?: string
) => {
  let message = "";
  let parsedPaymentData;

  try {
    const res = await verifyPayment(transactionId);
    console.log(res);
    if (!res || res.pay_status !== "Successful") {
      throw new Error("Payment verification failed or was not successful.");
    }

    if (res) {
      try {
        parsedPaymentData =
          typeof payloadData === "string"
            ? JSON.parse(payloadData)
            : payloadData;
      } catch (error) {
        throw new Error("Invalid JSON format in payment data");
      }

      if (
        !parsedPaymentData.user ||
        !parsedPaymentData.title ||
        !parsedPaymentData.price ||
        !parsedPaymentData.transactionId ||
        !parsedPaymentData.expiry
      ) {
        throw new Error("Missing required payment data fields.");
      }
    }

    const paymentInfo = {
      user: parsedPaymentData?.user,
      transactionId: transactionId,
      packageName: parsedPaymentData?.title,
      packagePrice: parsedPaymentData?.price,
      status: res.pay_status === "Successful" ? "completed" : "failed",
      expiryDate: calculateExpiryDate(parsedPaymentData?.expiry),
    };
    const payment = await Payment.create(paymentInfo);

    if (res?.pay_status === "Successful") {
      await User.findByIdAndUpdate(
        {
          _id: parsedPaymentData?.user,
        },
        {
          isVerified: true,

          subscriptions: paymentInfo?.packageName,
          $push: { payments: payment._id }, // Push the created payment _id to the user's payments array
        },
        { new: true }
      );

      message = "Payment successful";

      const filePath = join(__dirname, "../../../../public/confirmation.html");
      let template = readFileSync(filePath, "utf-8");
      template = template.replace("{{message}}", message);
      return template;
    } else {
      throw new Error("Payment validation failed.");
    }
  } catch (error) {
    message = "Payment failed";
    const filePath = join(__dirname, "../../../../public/faildpayment.html");
    let template;
    try {
      template = readFileSync(filePath, "utf-8");
    } catch (error) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "Internal server error!"
      );
    }
    template = template.replace("{{message}}", message);
    return template;
  }
};
export const PaymentService = {
  createPaymentIntoDB,
  getAllPaymentIntoDB,
  getSinglePaymentIntoDB,
  confirmationServiceIntoDB,
};
