import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { PaymentService } from "./payment.service";

const createPayment = catchAsync(async (req, res) => {
  const result = await PaymentService.createPaymentIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment Created Successfully",
    data: result,
  });
});
const getAllPayment = catchAsync(async (req, res) => {
  const result = await PaymentService.getAllPaymentIntoDB();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment fetched successfully",
    data: result,
  });
});

const getSinglePayment = catchAsync(async (req, res) => {
  const paymentId = req.params.id;
  const result = await PaymentService.getSinglePaymentIntoDB(paymentId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Payment fetched successfully",
    data: result,
  });
});
const confirmationController = catchAsync(async (req, res) => {
  const { transactionId, status, payloadData } = req.query;

  const result = await PaymentService.confirmationServiceIntoDB(
    transactionId as string,
    status as string,
    payloadData as string
  );

  res.send(result);
});
export const PaymentControllers = {
  createPayment,
  getAllPayment,
  getSinglePayment,
  confirmationController,
};
