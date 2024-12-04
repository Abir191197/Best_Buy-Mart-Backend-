export default interface ProductQueryParams {
  searchTerm?: string;
  sort?: Record<string, "asc" | "desc">;
  skip?: number;
  limit?: number;
  fields?: Record<string, boolean>;
}
