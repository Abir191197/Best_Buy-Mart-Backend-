import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createOrderIntoDB = async (orderData: any) => {
  const {
    userId,
    shopId,
    productId,
    quantity,
    paymentMethod,
    discountSave,
  } = orderData;

  // Retrieve product details to calculate price and validate availability
  const product = await prisma.product.findUnique({
    where: { productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  // Check if there's sufficient stock
  if (product.stock < quantity) {
    throw new Error("Insufficient stock for the product");
  }

  // Calculate the total price
  const priceBeforeDiscount = product.price * quantity;
  const totalPrice = discountSave
    ? parseFloat((priceBeforeDiscount - discountSave).toFixed(2))
    : parseFloat(priceBeforeDiscount.toFixed(2));

  // Create the order
  const order = await prisma.order.create({
    data: {
      customerId: userId,
      shopId,
      productId,
      quantity,
      totalAmount: totalPrice,
      discountSave: parseFloat(discountSave) || 0, // Store discount if present
      paymentMethod,
      status: "PENDING", // Default status is PENDING
      orderDate: new Date(),
    },
  });

  // Reduce product stock
  await prisma.product.update({
    where: { productId },
    data: { stock: product.stock - quantity },
  });

  return order; // Return the created order
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
  console.log(user.userId);

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
