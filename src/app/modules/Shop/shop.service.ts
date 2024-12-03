import { PrismaClient, Shop_Status } from "@prisma/client";
const prisma = new PrismaClient();

const createShopIntoDB = async (shopData: any) => {
  try {
    // Create a new shop, including associated images (logo in this case)
    const shop = await prisma.shop.create({
      data: {
        name: shopData.name,
            description: shopData.description,
        userId: shopData.userId,
        logo: {
          create: shopData.images.map((img: any) => ({
            imgPath: img.path, // Save the image URL from S3
            imgSize: img.size, // Save the image size
          })),
        },
      },
      include: {
        logo: true, // Include the logo (images) in the response
      },
    });

    console.log("Shop created with images:", shop);
    return shop; // Return the created shop with logos (images)
  } catch (error) {
    console.error("Error creating shop:", error);
    throw error;
  }
};

const getAllShopFromDB = async () => {

  try {
    // Get all shops from the database
    const shops = await prisma.shop.findMany({
      include: {
        logo: true, // Include the logo (images) in the response
      },
    });

   
    return shops; // Return the retrieved shops
  } catch (error) {
    
    throw error;
  }
}


const getMyShopFromDB = async (userId: string) => {
  try {
    // Get all shops from the database
     const shops = await prisma.shop.findMany({
       where: {
         userId: userId,
         
           
          
       },
       select: {
         shopId: true,
         name: true,
         description: true,
         status: true,
         createdAt: true,
         updatedAt: true,
         logo: true,
         products: true, // Include logos associated with the shop
       },
     });

    console.log("Shops retrieved for vendor:", shops);
    return shops; // Return the retrieved shops
  } catch (error) {
    console.error("Error getting shops for vendor:", error);
    throw error;
  }
};

const approveShopByIdIntoDB = async (shopId: string, status: Shop_Status) => {
  try {
    // Approve the shop by updating the status to "APPROVED"
    const updatedShop = await prisma.shop.update({
      where: {
        shopId: shopId, // Find the shop by ID
      },
      data: {
        status: status, // Update the status to "APPROVED"
      },
    });

    console.log("Shop approved:", updatedShop);
    return updatedShop; // Return the updated shop
  } catch (error) {
    console.error("Error approving shop:", error);
    throw error;
  }
};



const updateShopInDB = async (shopId: string, shopData: any) => {
  try {
    // Update the shop by ID
    const updatedShop = await prisma.shop.update({
      where: {
        shopId: shopId, // Find the shop by ID
      },
      data: {
        name: shopData.name,
        description: shopData.description,
        status: "PENDING",
        logo: {
          create: shopData.images?.map((img: any) => ({
            imgPath: img.path, // Save the image URL from S3
            imgSize: img.size, // Save the image size
          })),
        },
      },
      include: {
        logo: true, // Include the logo (images) in the response
      },

    });

    console.log("Shop updated with images:", updatedShop);
    return updatedShop; // Return the updated shop with logos (images)
  } catch (error) {
    console.error("Error updating shop:", error);
    throw error;
  }
};





export const ShopService = {
  createShopIntoDB,
  getAllShopFromDB,
  getMyShopFromDB,
  approveShopByIdIntoDB,
  updateShopInDB,
};
