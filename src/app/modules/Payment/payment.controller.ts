
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const validatePayment = catchAsync(async (req, res) => {
    const validData = req.body;
    console.log(validData);
  const result = await PaymentService.validatePaymentIntoDB(validData);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Payment validate successfully",
    data: result,
  });
});



export const PaymentController = {
  validatePayment,
  
};