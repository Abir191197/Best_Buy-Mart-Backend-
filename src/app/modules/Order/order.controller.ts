import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
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
      message:
        error instanceof Error ? error.message : "Failed to create order",
    });
  }
});

const getAllForOrdersAdmin = catchAsync(async (req, res) => {
  try {
    // Retrieve all orders from the service
    const orders = await orderService.getAllOrdersForAdminFromDB();

    // Send success response
    sendResponse(res, {
      statusCode: StatusCodes.OK, // 200 OK
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);

    // Send error response
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to retrieve orders",
    });
  }
});

const getAllForOrdersVendor = catchAsync(async (req, res) => {
  try {
    const user = req.user;
    const orders = await orderService.getAllOrdersForVendorFromDB(user);

    // Send success response
    sendResponse(res, {
      statusCode: StatusCodes.OK, // 200 OK
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);

    // Send error response
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to retrieve orders",
    });
  }
});

const getAllOrderForCustomer = catchAsync(async (req, res) => {
  try {
    const user = req.user;
    const orders = await orderService.getAllOrdersForCustomerFromDB(user);

    // Send success response
    sendResponse(res, {
      statusCode: StatusCodes.OK, // 200 OK
      success: true,
      message: "Orders retrieved successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);

    // Send error response
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to retrieve orders",
    });
  }
});



export const orderController = {
  createOrder,
  getAllForOrdersAdmin,
  getAllForOrdersVendor,
  getAllOrderForCustomer,
};
