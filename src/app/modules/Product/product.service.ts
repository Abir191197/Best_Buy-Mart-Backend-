import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const createProductIntoDB = async (productData: any) => {
  try {
    // Create a new product, including associated images
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        isAvailable: productData.isAvailable,
        ProductImg: {
          create: productData.images.map((img: any) => ({
            imgPath: img.path, // Save the image path
            imgSize: img.size, // Save the image size
          })),
        },
      },
      include: {
        ProductImg: true, // Include the product images in the response
      },
    });

    console.log("Product created with images:", product);
    return product; // Return the created product with images
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const ProductService = {
  createProductIntoDB,
};
