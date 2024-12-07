import { StatusCodes } from "http-status-codes";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/catchAsync";
import { orderService } from "./order.service";

const createOrder = catchAsync(async (req, res) => {
  try {
    const orderData = req.body;

    // Pass orderData to the service for processing and creation
    const order = await orderService.createOrderIntoDB(orderData);

    // Send success response
    sendResponse(res, {
      statusCode: StatusCodes.CREATED, // 201 Created
      success: true,
      message: "Order created successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error creating order:", error);

    // Send error response
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create order",
    });
  }
});

export const orderController = { createOrder };
