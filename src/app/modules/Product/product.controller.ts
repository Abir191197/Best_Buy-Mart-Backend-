import { ProductService } from "./product.service";
import { Request, Response } from "express";

const productCreate = async (req: Request, res: Response) => {
  try {
    const { data } = req.body; // Extract product data from the request body
    interface CustomFile extends Express.Multer.File {
      location: string;
    }

    const images = req.files as CustomFile[]; // Get the uploaded images

    // Construct the productData object, including S3 image URLs
    const productData = {
      ...data,
      images: images.map((file) => ({
        path: file.location, // S3 URL of the uploaded image
        size: file.size, // Image size
      })),
    };

    // Save product data into the database
    const createdProduct = await ProductService.createProductIntoDB(
      productData
    );

    res.status(201).json({
      message: "Product created successfully",
      product: createdProduct,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Error creating product" });
  }
};

export const productController = {
  productCreate,
};
