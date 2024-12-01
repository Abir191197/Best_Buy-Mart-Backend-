import { sendPaymentRequest } from "./payment.utils";

const paymentData = {
  bookingId: "BOOK1234", // Replace with your actual booking ID
  UserData: {
    name: "John Doe",
    email: "johndoe@example.com",
    address: "123 Street, City",
    phone: "01712345678",
  },
};

sendPaymentRequest(paymentData)
  .then((response) => {
    console.log("Payment request response:", response);
  })
  .catch((error) => {
    console.error("Error sending payment request:", error);
  });
