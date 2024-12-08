import { SSLService } from "./payment.utils";

const validatePaymentIntoDB = async (payload: any) => {

    console.log("valid payment", payload);
  
  // Validate the payment using the SSLService
  const validationResponse = await SSLService.validatePayment(payload);

  // Check the status of the validation response
//   if (validationResponse?.status  !== "VALID") {
//     return {
//       message: "Payment Failed!",
//     };
//   }

  // Payment is valid
  return {
    message: "Payment success!",
  };
};
export const PaymentService = {
  validatePaymentIntoDB,
};