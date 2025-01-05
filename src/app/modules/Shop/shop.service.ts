import { PrismaClient, Shop_Status } from "@prisma/client";
import { ShopData } from "../../utils/interface";
const prisma = new PrismaClient();


// Define the interface for shop data


const createShopIntoDB = async (shopData: any) => {
  console.log(shopData);
  try {
    // Validate input (basic checks)
    if (
      !shopData.name ||
      !shopData.description ||
      !shopData.userId ||
      !shopData.logoImgPath ||
      !shopData.logoImgSize
    ) {
      throw new Error(
        "Missing required fields (name, description, userId, or images)."
      );
    }

    // Check if userId exists in the User table
    const userExists = await prisma.user.findUnique({
      where: { userId: shopData.userId },
    });

    if (!userExists) {
      throw new Error(`User with userId ${shopData.userId} does not exist.`);
    }

    // Create the shop in the database
    const shop = await prisma.shop.create({
      data: {
        name: shopData.name,
        description: shopData.description,
        userId: shopData.userId,
        logoImgPath: shopData.logoImgPath,
        logoImgSize: shopData.logoImgSize,
      },
    });

    console.log("Shop created successfully:", shop);
    return shop; // Return the created shop
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating shop:", error.message); // Improved error logging
    } else {
      console.error("Error creating shop:", error); // Fallback for non-Error objects
    }
    throw new Error("Failed to create shop. Please try again."); // More generic error for users
  }
};


const getAllShopFromDB = async () => {
  try {
    const shops = await prisma.shop.findMany({
      select: {
        shopId: true,
        name: true,
        description: true,
        status: true,
        logoImgPath: true,
        logoImgSize: true,
        createdAt: true,
        updatedAt: true,
        products: {
          select: {
            productId: true,
            name: true,
            price: true,
          },
        },
      },
    });

    return shops;
  } catch (error) {
    console.error("Error fetching shops:", error);
    throw error;
  }
};

const getMyShopFromDB = async (userId: string) => {
  try {
    const shops = await prisma.shop.findMany({
      where: {
        userId,
      },
      select: {
        shopId: true,
        name: true,
        description: true,
        status: true,
        logoImgPath: true,
        logoImgSize: true,
        createdAt: true,
        updatedAt: true,
        products: {
          select: {
            productId: true,
            name: true,
          },
        },
      },
    });

    return shops;
  } catch (error) {
    console.error("Error fetching user shops:", error);
    throw error;
  }
};

const approveShopByIdIntoDB = async (shopId: string, status: Shop_Status) => {
  try {
    const updatedShop = await prisma.shop.update({
      where: {
        shopId,
      },
      data: {
        status, // e.g., "APPROVED" or "REJECTED"
      },
    });

    console.log("Shop approved successfully:", updatedShop);
    return updatedShop;
  } catch (error) {
    console.error("Error approving shop:", error);
    throw error;
  }
};

const updateShopInDB = async (shopId: string, shopData: any) => {
  try {
    // Validate input data
    if (!shopId || !shopData) {
      throw new Error("Shop ID and shop data are required.");
    }

    // Check if the shop exists before updating
    const existingShop = await prisma.shop.findUnique({
      where: {
        shopId,
      },
    });

    if (!existingShop) {
      throw new Error("Shop not found.");
    }

    // Prepare data for update
    const updateData: any = {
      name: shopData.name,
      description: shopData.description,
      status: "PENDING", // Reset status to "PENDING"
    };

    // Update logo only if provided
    if (shopData.logo) {
      updateData.logoImgPath = shopData.logo.path;
      updateData.logoImgSize = shopData.logo.size;
    }

    // Perform the update operation
    const updatedShop = await prisma.shop.update({
      where: {
        shopId,
      },
      data: updateData,
    });

    console.log("Shop updated successfully:", updatedShop);
    return updatedShop;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating shop:", error.message);
    } else {
      console.error("Error updating shop:", error);
    }
    throw new Error("Failed to update shop. Please try again.");
  }
};


export const ShopService = {
  createShopIntoDB,
  getAllShopFromDB,
  getMyShopFromDB,
  approveShopByIdIntoDB,
  updateShopInDB,
};
