import { PrismaClient, Prisma } from "@prisma/client";

class QueryBuilder<T> {
  private prismaClient: PrismaClient;
  private modelName: string;
  private query: Record<string, unknown>;
  private queryParams: Prisma.PrismaArgs["findMany"]; // Structure for `findMany` options

  constructor(
    prismaClient: PrismaClient,
    modelName: string,
    query: Record<string, unknown>
  ) {
    this.prismaClient = prismaClient;
    this.modelName = modelName;
    this.query = query;
    this.queryParams = {};
  }

  search(searchableFields: string[]) {
    const searchTerm = this.query.searchTerm as string | undefined;

    if (searchTerm) {
      const searchConditions = searchableFields.map((field) => ({
        [field]: { contains: searchTerm, mode: "insensitive" },
      }));

      this.queryParams.where = {
        ...(this.queryParams.where || {}),
        OR: searchConditions,
      };
    }

    return this;
  }

  filter() {
    const queryObj = { ...this.query };
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields"];
    excludeFields.forEach((el) => delete queryObj[el]);

    this.queryParams.where = {
      ...(this.queryParams.where || {}),
      ...queryObj,
    };

    return this;
  }

  sort() {
    const sort = (this.query.sort as string)?.split(",").map((s) => {
      const [field, order] = s.split(":");
      return { [field]: order === "desc" ? "desc" : "asc" };
    });

    if (sort && sort.length > 0) {
      this.queryParams.orderBy = sort;
    }

    return this;
  }

  paginate() {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 500;
    const skip = (page - 1) * limit;

    this.queryParams.skip = skip;
    this.queryParams.take = limit;

    return this;
  }

  fields() {
    const fields = this.query.fields as string | undefined;

    if (fields) {
      this.queryParams.select = fields.split(",").reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {} as Record<string, boolean>);
    }

    return this;
  }

  async execute(): Promise<T[]> {
    const model = this.prismaClient[
      this.modelName as keyof PrismaClient
    ] as any;

    if (!model || typeof model.findMany !== "function") {
      throw new Error(
        `Model "${this.modelName}" does not exist on PrismaClient.`
      );
    }

    return model.findMany(this.queryParams);
  }
}

export default QueryBuilder;
