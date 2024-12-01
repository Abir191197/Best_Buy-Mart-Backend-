"use strict";
// import axios from "axios";
// import config from "../../../config";
// const url = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"; // SSLCOMMERZ initiation API URL
// export async function createPaymentSession(paymentData: {
//   bookingId: string;
//   UserData: {
//     name: string;
//     email: string;
//     address: string;
//     phone: string;
//   };
// }) {
//   // Ensure environment variables are present
//   if (!config.STORE_ID || !config.STORE_SECRET) {
//     throw new Error("Missing store credentials in configuration.");
//   }
//   // Construct the payload
//   const payload = ({
//     store_id: config.STORE_ID,
//     store_passwd: config.STORE_SECRET,
//     tran_id: paymentData.bookingId,
//     total_amount: "100",
//     currency: "BDT",
//     success_url: `https://yourdomain.com/success?bookingId=${paymentData.bookingId}`,
//     fail_url: `https://yourdomain.com/fail?bookingId=${paymentData.bookingId}`,
//     cancel_url: `https://yourdomain.com/cancel?bookingId=${paymentData.bookingId}`,
//     cus_name: paymentData.UserData.name,
//     cus_email: paymentData.UserData.email,
//     cus_add1: paymentData.UserData.address,
//     cus_phone: paymentData.UserData.phone,
//     ship_name: paymentData.UserData.name,
//     ship_add1: paymentData.UserData.address,
//     ship_city: "dhaka",
//     ship_state: "dhaka",
//     ship_postcode: "1212",
//     ship_country: "bangladesh",
//     multi_card_name: "mastercard,visacard,amexcard",
//     value_a: "ref001_A",
//     value_b: "ref002_B",
//     value_c: "ref003_C",
//     value_d: "ref004_D",
//     shipping_method: "ref005_E",
//     product_name: "cloth",
//     product_category: "cloth",
//     product_profile: "physical-goods",
//   });
//   try {
//     // Send POST request
//     const response = await axios.post(url, payload, );
//     // Check if the response contains an error
//     if (response.data.status === "FAILED") {
//       throw new Error(
//         `Payment initiation failed: ${response.data.failedreason}`
//       );
//     }
//     return response.data; // Successful response
//   } catch (error) {
//     console.error("Error creating payment session:", error.message || error);
//     throw error;
//   }
// }
