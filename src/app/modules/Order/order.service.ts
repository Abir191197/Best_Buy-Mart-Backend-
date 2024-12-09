import { PrismaClient } from "@prisma/client";
import { SSLService } from "../Payment/payment.utils";
import AppError from "../../Error/appError";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

// Create Order Function
export const createOrderIntoDB = async (orderData: any) => {
  const { userId, shopId, productId, quantity, paymentMethod, discountSave } =
    orderData;

  // Retrieve user details
  const userDetail = await prisma.user.findUnique({
    where: { userId },
    select: {
      phone: true,
      name: true,
      email: true,
      street: true,
      city: true,
      country: true,
      postalCode: true,
      state: true,

    },
  });

  if (!userDetail) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  const userAddress = {
    street: userDetail?.street || "N/A",
    city: userDetail?.city || "N/A",
    state: userDetail?.state || "N/A",
    country: userDetail?.country || "Bangladesh",
    postalCode: userDetail?.postalCode || "N/A",
    phone: userDetail?.phone || "N/A",
  };

  // Retrieve product details
  const product = await prisma.product.findUnique({
    where: { productId },
  });

  if (!product) {
    throw new AppError(StatusCodes.NOT_FOUND, "Product not found");
  }

  // Check if there's sufficient stock
  if (product.stock < quantity) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Insufficient stock for the product"
    );
  }

  // Calculate the total price
  const priceBeforeDiscount = product.price * quantity;
  const totalPrice = discountSave
    ? parseFloat((priceBeforeDiscount - discountSave).toFixed(2))
    : parseFloat(priceBeforeDiscount.toFixed(2));

  // Create the order in the database
  const order = await prisma.order.create({
    data: {
      trackingId: `ORD-${Date.now()}`, // Generate a unique order ID
      customerId: userId,
      shopId,
      productId,
      quantity,
      totalAmount: totalPrice,
      discountSave: parseFloat(discountSave) || 0, // Discount applied
      paymentMethod,
      status: "PENDING", // Default status
      orderDate: new Date(),
    },
  });

  try {
    // Payment integration
    const paymentResponse = await SSLService.Payment({
      amount: totalPrice,
      transactionId: order.trackingId,
      name: userDetail.name,
      email: userDetail.email,
      address: `${userAddress.street}, ${userAddress.city}, ${userAddress.state}, ${userAddress.postalCode}`,
      phoneNumber: userAddress.phone,
      productName: product.name,
      productCategory: product.category || "General", // Default category if not provided
    });

    console.log("Payment response:", paymentResponse);


  
    return { order, paymentResponse }; // Return the created order and payment response
  } catch (error) {
    // Rollback: Delete the order if payment fails
    //await prisma.order.delete({ where: { orderId: order.orderId } });
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Payment failed, order rolled back"
    );
  }
};


const getAllOrdersForAdminFromDB = async () => {
  return prisma.order.findMany({
    include: {
      customer: {
        select: {
          userId: true,
          name: true,
          email: true,
        },
      },
      product: {
        select: {
          productId: true,
          name: true,
          price: true,
        },
      },
      shop: {
        select: {
          shopId: true,
          name: true,
          
        },
      },
    },
    orderBy: {
      orderDate: "desc", // Orders sorted by most recent first
    },
  });
};
const getAllOrdersForVendorFromDB = async (user: any) => {


  return prisma.order.findMany({
    where: {
      shop: {
        userId: user.userId,  // Ensure the shop's userId matches the logged-in user's userId
      },
    },
    include: {
      customer: {
        select: {
          userId: true,
          name: true,
          email: true,
        },
      },
      product: {
        select: {
          productId: true,
          name: true,
          price: true,
        },
      },
      shop: {
        select: {
          shopId: true,
          name: true,
        },
      },
    },
    orderBy: {
      orderDate: "desc", // Orders sorted by most recent first
    },
  });
};

const getAllOrdersForCustomerFromDB = async (user: any) => {

  return prisma.order.findMany({
    where: {
      customerId: user.userId, // Ensure the customer's userId matches the logged-in user's userId
    },
    include: {
      product: {
        select: {
          productId: true,
          name: true,
          price: true,
        },
      },
      shop: {
        select: {
          shopId: true,
          name: true,
        },
      },
    },
    orderBy: {
      orderDate: "desc", // Orders sorted by most recent first
    },
  });
}



export const orderService = {
  createOrderIntoDB,
  getAllOrdersForAdminFromDB,
  getAllOrdersForVendorFromDB,
  getAllOrdersForCustomerFromDB,
};
