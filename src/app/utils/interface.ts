export interface ShopData {
  name: string;
  description: string;
  userId: string;
  images: Array<{
    path: string; // S3 URL of the logo image
    size: number; // Image size
  }>;
}
