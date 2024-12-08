import { SSLService } from "./payment.utils";

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

  

  // Payment is valid, proceed to process the order (e.g., update database)
  console.log("Payment validated successfully:", validationResponse);

  return {
    message: "Payment success!",
    details: validationResponse,
  };
};

export const PaymentService = {
  validatePaymentIntoDB,
};
