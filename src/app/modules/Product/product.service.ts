import { PrismaClient, Prisma } from "@prisma/client";
import ProductQueryParams from "./interface";
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
        category: productData.category,
        shopId: productData.shopId,
        ProductImg: {
          create: productData.images.map((img: any) => ({
            imgPath: img.path, // Save the image URL from S3
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


const getAllProductsFromDB = async (query: ProductQueryParams) => {
  try {
    const { searchTerm, sort, skip = 0, limit = 10, fields } = query;

    // Build the search condition if searchTerm is provided
    const searchCondition = searchTerm
      ? {
          OR: [
            { name: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } }, // Search in product name
            { description: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } }, // Search in description
          ],
        }
      : undefined;

    // Fetch products from the database with pagination, sorting, filtering, and field selection
    const products = await prisma.product.findMany({
      where: searchCondition, // Apply search condition if available
      orderBy: sort, // Sorting by provided parameters
      skip, // Pagination: skip items
      take: limit, // Pagination: limit the number of results
      select: fields || undefined, // Select specific fields if provided
    });

    console.log("Products retrieved:", products);
    return products; // Return the products fetched from the database
  } catch (error) {
    console.error("Error retrieving products:", error);
    throw new Error("Failed to retrieve products. Please try again.");
  }
};








export const ProductService = {
  createProductIntoDB,
  getAllProductsFromDB,
}
