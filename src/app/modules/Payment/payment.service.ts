import { StatusCodes } from "http-status-codes";
import { SSLService } from "./payment.utils";
import { PrismaClient } from "@prisma/client";
import AppError from "../../Error/appError";
const prisma = new PrismaClient();
const validatePaymentIntoDB = async (payload: any) => {
  console.log("Processing IPN Data:", payload);

  //// Check the validation status
  if (payload?.status !== "VALID") {
    console.error("Payment validation failed:", );
    return {
      message: "Payment Failed!",
      
    };
    }
  
  //  Validate the payment using the SSLCommerz service
  const validationResponse = await SSLService.validatePayment(payload.val_id);

   
  

  

  return {
    message: "Payment success!",
    details: validationResponse,
  };
};



const updatePaymentStatusIntoDB = async (payload: {
  transactionId : any;
 
}) => {
  console.log("Updating Payment Status in DB:", payload);

  const { transactionId } = payload;

  

  // Update the payment status in the database
  const updatedOrder = await prisma.order.update({
    where: { trackingId: transactionId },
    data: { paymentStatus: "PAID" },
  });

  if (!updatedOrder) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Order not found or could not update payment status."
    );
  }

  return updatedOrder;
};



export const PaymentService = {
  validatePaymentIntoDB,
  updatePaymentStatusIntoDB,
};
