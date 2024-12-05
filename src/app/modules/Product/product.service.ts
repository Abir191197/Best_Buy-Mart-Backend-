import { Prisma, PrismaClient } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";
import ProductQueryParams from "./interface";
const prisma = new PrismaClient();

const createProductIntoDB = async (productData: any) => {
  try {
    // Check the status of the shop by its ID
    const shop = await prisma.shop.findUnique({
      where: {
        shopId: productData.shopId, // Use the provided shopId
      },
      select: {
        status: true, // Fetch only the status field
      },
    });

    if (!shop) {
      throw new Error("Shop not found. Unable to create product.");
    }

    // Check if the shop status is restricted
    if (["PENDING", "REVIEW PENDING", "SUSPEND"].includes(shop.status)) {
      throw new Error(`Cannot add product. Shop status is ${shop.status}.`);
    }

    // Create a new product, including associated images
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        stock: productData.stock,
        category: productData.category,
        shopId: productData.shopId,
        ProductImg: {
          create: productData.images.map((img: any) => ({
            imgPath: img.path, // Save the image URL from S3
            imgSize: img.size, // Save the image size
          })),
        },
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
    const searchCondition: Prisma.ProductWhereInput | undefined = searchTerm
      ? {
          OR: [
            {
              name: {
                contains: searchTerm,
                mode: Prisma.QueryMode.insensitive, // Case insensitive search
              },
            }, // Search in product name
            {
              description: {
                contains: searchTerm,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            // Search in description
          ],
        }
      : undefined;

    // Fetch products from the database with pagination, sorting, filtering, and field selection
    const products = await prisma.product.findMany({
      where: {
        ...searchCondition, // Apply search condition if available
        isDeleted: false, // Ensure only non-deleted products are included
        shop: {
          status: {
            notIn: ["PENDING", "REVIEW_PENDING", "SUSPENDED"], // Exclude products associated with shops having status "PENDING" and "REVIEW_PENDING"
          },
        },
      },
      orderBy: sort, // Sorting by provided parameters
      skip, // Pagination: skip items
      take: limit, // Pagination: limit the number of results
      // Select specific fields if provided
      include: {
        ProductImg: true, // Include related Product images
        Review: true, // Include related reviews
        shop: true, // Include related shop data
      },
    });

    console.log("Products retrieved:", products);
    return products; // Return the products fetched from the database
  } catch (error) {
    console.error("Error retrieving products:", error);
    throw new Error("Failed to retrieve products. Please try again.");
  }
};

//get single product from db

const getProductFromDB = async (productId: string) => {
  try {
    // Fetch the product with the given ID
    const product = await prisma.product.findUnique({
      where: {
        productId: productId, // Match the product by its ID
      },
      include: {
        ProductImg: true, // Include related product images
        Review: true, // Include related reviews
        shop: true, // Include related shop data
      },
    });

    if (!product) {
      throw new Error("Product not found!");
    }

    console.log("Product retrieved:", product);
    return product; // Return the product fetched from the database
  } catch (error) {
    console.error("Error getting product:", error);
    throw new Error("Failed to get product. Please try again.");
  }
};

const updateProductInDB = async (productId: string, updateData: any) => {
  try {
    // Update the product with the given ID
    const updatedProduct = await prisma.product.update({
      where: {
        productId: productId, // Match the product by its ID
      },
      data: {
        name: updateData.name,
        description: updateData.description,
        price: updateData.price,
        stock: updateData.stock,
        category: updateData.category,
        ProductImg: updateData.ProductImg ? updateData.ProductImg : undefined, // Only update images if provided
      },
      include: {
        ProductImg: true, // Include related product images
        Review: true, // Include related reviews
      },
    });

    console.log("Product updated with new data:", updatedProduct);
    return updatedProduct; // Return the updated product with images
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Failed to update product. Please try again.");
  }
};

// Service function to duplicate and edit a product
const duplicateProductInDB = async (productId: any, updatedData: any) => {
  console.log("productId from service", productId);
  try {
    // Find the existing product to duplicate
    const existingProduct = await prisma.product.findUnique({
      where: {
        productId: productId, // Find product by productId
      },
      include: {
        ProductImg: true, // Include associated images
        shop: true, // Include associated shop for validation (if needed)
      },
    });

    if (!existingProduct) {
      throw new Error("Product not found!");
    }

    // Map only the necessary fields (imgPath and imgSize) for duplication
    const imagesToCreate = existingProduct.ProductImg.map((img: any) => {
      return {
        imgPath: img.imgPath, // Only take the imgPath from the existing image
        imgSize: img.imgSize, // Only take the imgSize from the existing image
      };
    });

    // Construct the data for the new product, using the images to create the new product
    const newProductData = {
      name: updatedData.name || existingProduct.name,
      description: updatedData.description || existingProduct.description,
      price: updatedData.price || existingProduct.price,
      stock: updatedData.stock || existingProduct.stock,
      category: updatedData.category || existingProduct.category,
      shopId: updatedData.shopId || existingProduct.shopId, // Use provided shopId or retain the existing one
      ProductImg: {
        create: updatedData.images
          ? updatedData.images.map((img: any) => ({
              imgPath: img.path, // Use new images if provided
              imgSize: img.size,
            }))
          : imagesToCreate, // Use the mapped image data for the new product
      },
    };

    // Create the new duplicated product with the updated data
    const duplicatedProduct = await prisma.product.create({
      data: newProductData,
    });

    console.log("Product duplicated successfully:", duplicatedProduct);
    return duplicatedProduct;
  } catch (error) {
    console.error("Error duplicating product:", error);
    throw new Error("Failed to duplicate product. Please try again.");
  }
};

//track add recent product view by user

const trackProductViewInDB = async (userId: JwtPayload, productId: any) => {
  try {
    // Check if the user has already viewed the product
    const existingView = await prisma.recentproductview.findFirst({
      where: {
        productId: productId, // Match the product by its ID
        userId: userId, // Match the user by their ID
      },
    });

    // If the user has not viewed the product, create a new view record
    if (!existingView) {
      await prisma.recentproductview.create({
        data: {
          productId: productId, // Set the product ID
          userId: userId, // Set the user ID
        },
      });
    }

    console.log("Product view tracked successfully");
    return true; // Return true if the view is tracked successfully
  } catch (error) {
    console.error("Error tracking product view:", error);
    throw new Error("Failed to track product view. Please try again.");
  }
};


//get recent product view by user

const getRecentProductViewFromDB = async (userId: JwtPayload) => {
  try {
    // Fetch the recent product views by the user
    const recentViews = await prisma.recentproductview.findMany({
      where: {
        userId: userId, // Match the user by their ID
      },
      orderBy: {
        createdAt: "desc", // Sort the views by creation date in descending order
      },
      take: 5, // Limit the number of recent views to 5
      include: {
        product: true, // Include related product data
      },
    });

    console.log("Recent product views retrieved successfully");
    return recentViews; // Return the recent product views fetched from the database
  } catch (error) {
    console.error("Error getting recent product views:", error);
    throw new Error("Failed to get recent product views. Please try again.");
  }
}

export const ProductService = {
  createProductIntoDB,
  getAllProductsFromDB,
  getProductFromDB,
  updateProductInDB,
  duplicateProductInDB,
  trackProductViewInDB,
  getRecentProductViewFromDB,
};
