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
exports.calculateExpiryDate = exports.verifyPayment = exports.initiatePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const index_1 = __importDefault(require("../config/index"));
const initiatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const payloadData = encodeURIComponent(JSON.stringify(payload));
    try {
        const response = yield axios_1.default.post(index_1.default.payment_url, {
            store_id: index_1.default.store_id,
            signature_key: index_1.default.signature_key,
            tran_id: payload.transactionId,
            success_url: `${index_1.default.backend_url}/api/v1/payment/confirmation?transactionId=${payload.transactionId}&status=success&payloadData=${payloadData}`,
            fail_url: `${index_1.default.backend_url}/api/v1/payment/confirmation?transactionId=${payload.transactionId}&status=failed`,
            cancel_url: `${index_1.default.client_url}`,
            amount: payload.price,
            currency: "BDT",
            desc: "Merchant Registration Payment",
            cus_name: payload === null || payload === void 0 ? void 0 : payload.userName,
            cus_email: payload === null || payload === void 0 ? void 0 : payload.email,
            cus_add1: payload === null || payload === void 0 ? void 0 : payload.address,
            cus_add2: payload === null || payload === void 0 ? void 0 : payload.address,
            cus_city: "Dhaka",
            cus_state: "Dhaka",
            cus_postcode: "1206",
            cus_country: "Bangladesh",
            cus_phone: "133555666",
            type: "json",
        });
        return response.data;
    }
    catch (error) {
        console.error("Error initiating payment:", error);
        throw new Error("Payment initiation failed!");
    }
});
exports.initiatePayment = initiatePayment;
const verifyPayment = (tnxId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(index_1.default.payment_verify_url, {
            params: {
                store_id: index_1.default.store_id,
                signature_key: index_1.default.signature_key,
                type: "json",
                request_id: tnxId,
            },
        });
        return response.data;
    }
    catch (err) {
        console.error("Error verifying payment:", err.response ? err.response.data : err.message);
        throw new Error("Payment validation failed!");
    }
});
exports.verifyPayment = verifyPayment;
function calculateExpiryDate(expiry) {
    const currentDate = new Date();
    if (expiry === "1 Week") {
        return new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
    }
    else if (expiry === "2 Days") {
        return new Date(currentDate.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();
    }
    else if (expiry === "1 Month") {
        currentDate.setMonth(currentDate.getMonth() + 1);
        return currentDate.toISOString();
    }
    else {
        return expiry;
    }
}
exports.calculateExpiryDate = calculateExpiryDate;
