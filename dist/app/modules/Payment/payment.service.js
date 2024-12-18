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
exports.PaymentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const user_model_1 = require("../user/user.model");
const payment_model_1 = require("./payment.model");
const PaymentGetway_1 = require("../../../helpers/PaymentGetway");
const path_1 = require("path");
const fs_1 = require("fs");
const uuid_1 = require("uuid");
const createPaymentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!payload.user || !payload.amount || !payload.method) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Missing required payment fields!");
    }
    // Check if the user exists
    const isUserExist = yield user_model_1.User.findById(payload.user);
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Generate a unique transaction ID
    const newTransactionId = (0, uuid_1.v4)();
    const paymentData = Object.assign(Object.assign({}, payload), { transactionId: newTransactionId, userName: isUserExist.name, email: isUserExist.email, phoneNumber: isUserExist.phone || "N/A", address: isUserExist.addressBook || "Dhaka" });
    try {
        // Initiate the payment session
        const paymentSession = yield (0, PaymentGetway_1.initiatePayment)(paymentData);
        // Create a payment record in the database
        const newPayment = yield payment_model_1.Payment.create({
            order: payload.order,
            user: payload.user,
            amount: payload.amount,
            method: payload.method,
            status: "pending", // Default status until confirmed
            transactionId: newTransactionId,
        });
        return { paymentSession, newPayment };
    }
    catch (error) {
        console.error("Payment creation failed:", error);
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create payment!");
    }
});
const getAllPaymentIntoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payment_model_1.Payment.find().populate("user");
    return result;
});
const getSinglePaymentIntoDB = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield payment_model_1.Payment.findById(paymentId);
    if (!payment) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Payment Not Found!");
    }
    return payment;
});
const confirmationServiceIntoDB = (transactionId, status, payloadData) => __awaiter(void 0, void 0, void 0, function* () {
    let message = "";
    let parsedPaymentData;
    try {
        const res = yield (0, PaymentGetway_1.verifyPayment)(transactionId);
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
            }
            catch (error) {
                throw new Error("Invalid JSON format in payment data");
            }
            if (!parsedPaymentData.user ||
                !parsedPaymentData.title ||
                !parsedPaymentData.price ||
                !parsedPaymentData.transactionId ||
                !parsedPaymentData.expiry) {
                throw new Error("Missing required payment data fields.");
            }
        }
        const paymentInfo = {
            user: parsedPaymentData === null || parsedPaymentData === void 0 ? void 0 : parsedPaymentData.user,
            transactionId: transactionId,
            packageName: parsedPaymentData === null || parsedPaymentData === void 0 ? void 0 : parsedPaymentData.title,
            packagePrice: parsedPaymentData === null || parsedPaymentData === void 0 ? void 0 : parsedPaymentData.price,
            status: res.pay_status === "Successful" ? "completed" : "failed",
            expiryDate: (0, PaymentGetway_1.calculateExpiryDate)(parsedPaymentData === null || parsedPaymentData === void 0 ? void 0 : parsedPaymentData.expiry),
        };
        const payment = yield payment_model_1.Payment.create(paymentInfo);
        if ((res === null || res === void 0 ? void 0 : res.pay_status) === "Successful") {
            yield user_model_1.User.findByIdAndUpdate({
                _id: parsedPaymentData === null || parsedPaymentData === void 0 ? void 0 : parsedPaymentData.user,
            }, {
                isVerified: true,
                subscriptions: paymentInfo === null || paymentInfo === void 0 ? void 0 : paymentInfo.packageName,
                $push: { payments: payment._id }, // Push the created payment _id to the user's payments array
            }, { new: true });
            message = "Payment successful";
            const filePath = (0, path_1.join)(__dirname, "../../../../public/confirmation.html");
            let template = (0, fs_1.readFileSync)(filePath, "utf-8");
            template = template.replace("{{message}}", message);
            return template;
        }
        else {
            throw new Error("Payment validation failed.");
        }
    }
    catch (error) {
        message = "Payment failed";
        const filePath = (0, path_1.join)(__dirname, "../../../../public/faildpayment.html");
        let template;
        try {
            template = (0, fs_1.readFileSync)(filePath, "utf-8");
        }
        catch (error) {
            throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Internal server error!");
        }
        template = template.replace("{{message}}", message);
        return template;
    }
});
exports.PaymentService = {
    createPaymentIntoDB,
    getAllPaymentIntoDB,
    getSinglePaymentIntoDB,
    confirmationServiceIntoDB,
};
