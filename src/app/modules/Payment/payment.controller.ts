import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";
import AppError from "../../Error/appError";

const validatePayment = catchAsync(async (req, res) => {
  const validData = req.body; 
    console.log("Received IPN Data:", validData);
    console.log(req.headers);
    console.log(req.params);
    console.log(req.query);

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

const paymentSuccess = catchAsync(async (req, res) => {
  const { transactionId, amount, redirectTo } = req.query; // Extract query parameters
  console.log("Payment Success Data:", { transactionId, redirectTo });

  // Update the payment status in the database
  const result = await PaymentService.updatePaymentStatusIntoDB({
    transactionId,
   
  });

  if (!result) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Failed to update payment status in the database."
    );
  }

  // Optional: Redirect the user if redirectTo is provided
  if (redirectTo) {
    const decodedRedirectUrl = decodeURIComponent(redirectTo as string);
    return res.redirect(decodedRedirectUrl);
  }

  // Send success response back to the client
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment status updated successfully",
    data: result,
  });
});



export const PaymentController = {
  validatePayment,
  paymentSuccess,
};
