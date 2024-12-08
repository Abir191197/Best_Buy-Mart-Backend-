import axios from "axios";
import { StatusCodes } from "http-status-codes";
import config from "../../../config";
import AppError from "../../Error/appError";

interface PaymentResponse {
  GatewayPageURL: string;
  [key: string]: any; // To handle any other properties that might be returned
}

const Payment = async (paymentData: any) => {
  try {
    const data = {
      store_id: config.STORE_ID,
      store_passwd: config.STORE_SECRET,
      total_amount: paymentData.amount,
      currency: "BDT",
      tran_id: paymentData.transactionId, // Unique transaction ID for the API call
      success_url: config.PAYMENT_SUCCESS_URL,
      fail_url: config.PAYMENT_FAIL_URL,
      cancel_url: config.PAYMENT_CANCEL_URL,
      ipn_url: `config.PAYMENT_IPN_URL/${paymentData.transactionId}`, // Replace with your IPN URL
      shipping_method: "N/A",
      product_name: paymentData.productName,
      product_category: paymentData.productCategory,
      product_profile: "general",
      cus_name: paymentData.name,
      cus_email: paymentData.email,
      cus_add1: paymentData.address,
      cus_add2: "N/A",
      cus_city: paymentData.city || "N/A",
      cus_state: paymentData.state || "N/A",
      cus_postcode: paymentData.postalCode || "N/A",
      cus_country: paymentData.country || "Bangladesh",
      cus_phone: paymentData.phoneNumber,
      cus_fax: "N/A",
      ship_name: "N/A",
      ship_add1: "N/A",
      ship_add2: "N/A",
      ship_city: "N/A",
      ship_state: "N/A",
      ship_postcode: "N/A",
      ship_country: "N/A",
    };

    console.log(data);

    const response = await axios.post<PaymentResponse>(
      config.STORE_URL as string,
      data,
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    if (response?.data) {
      return response.data.GatewayPageURL; // Return Gateway Page URL
    } else {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Failed to retrieve GatewayPageURL from the response"
      );
    }
  } catch (error) {
    // Improved error handling
    console.error(
      "Payment request error:",
      (error as any).response?.data || (error as any).message
    );
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      (error as any).response?.data?.error || "Payment Error occurred!"
    );
  }
};

const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${config.PAYMENT_VALIDATION_URL}?val_id=${payload.val_id}&store_id=${config.STORE_ID}&store_passwd=${config.STORE_SECRET}&format=json`,
    });
    console.log("valid",response.data);
    return response.data;
  } catch (err) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Payment validation failed!");
  }
};

export const SSLService = {
  Payment,
  validatePayment,
};


