import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createOrderIntoDB = async(orderData :any) => {
  const { userId, shopId, productId, quantity, paymentMethod } = orderData;

  // Retrieve product details to calculate price and validate availability
  const product = await prisma.product.findUnique({
    where: { productId },
  });

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    throw new Error("Insufficient stock for the product");
  }

  // Calculate total price
  const totalPrice = product.price * quantity;

  // Create the order
  const order = await prisma.order.create({
    data: {
      userId,
      shopId,
      productId,
      totalAmount: totalPrice,
      paymentMethod,
      status: "PENDING",
      orderDate: new Date(),
    },
  });

  // Reduce product stock
  await prisma.product.update({
    where: { productId },
    data: { stock: product.stock - quantity },
  });

  return order;
};

export const orderService = {
  createOrderIntoDB,
};
