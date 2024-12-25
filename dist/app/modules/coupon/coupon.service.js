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
exports.couponService = void 0;
const coupon_model_1 = __importDefault(require("./coupon.model"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createCoupon = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (new Date(payload.validFrom) >= new Date(payload.validUntil)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "validFrom must be earlier than validUntil");
    }
    const coupon = yield coupon_model_1.default.create(payload);
    return coupon;
});
const getCoupons = () => __awaiter(void 0, void 0, void 0, function* () {
    const coupons = yield coupon_model_1.default.find();
    return coupons;
});
const getCouponById = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.default.findById(couponId);
    if (!coupon) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Coupon not found");
    }
    return coupon;
});
const updateCoupon = (couponId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate updated payload
    if (payload.validFrom &&
        payload.validUntil &&
        new Date(payload.validFrom) >= new Date(payload.validUntil)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "validFrom must be earlier than validUntil");
    }
    const updatedCoupon = yield coupon_model_1.default.findByIdAndUpdate(couponId, payload, {
        new: true,
        runValidators: true,
    });
    if (!updatedCoupon) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Coupon not found to update");
    }
    return updatedCoupon;
});
const deleteCoupon = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
    const coupon = yield coupon_model_1.default.findById(couponId);
    if (!coupon) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Coupon not found");
    }
    yield coupon_model_1.default.deleteOne({ _id: couponId });
    return coupon;
});
exports.couponService = {
    createCoupon,
    getCoupons,
    getCouponById,
    deleteCoupon,
    updateCoupon,
};
