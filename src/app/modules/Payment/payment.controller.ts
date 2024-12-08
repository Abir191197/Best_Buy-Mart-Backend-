import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const validatePayment = catchAsync(async (req, res) => {
  const validData = req.params; // SSLCommerz sends data via POST in the body
  console.log("Received IPN Data:", validData);

  // Call the service to validate the payment
  const result = await PaymentService.validatePaymentIntoDB(validData);

  // Send a response back to SSLCommerz
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment validated successfully",
    data: result,
  });
});

export const PaymentController = {
  validatePayment,
};
