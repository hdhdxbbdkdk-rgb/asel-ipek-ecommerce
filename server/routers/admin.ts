import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { products, orders, users } from "../../drizzle/schema";
import { desc, eq } from "drizzle-orm";

export const adminRouter = router({
  // Get dashboard statistics
  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.role !== "admin") {
      throw new Error("Unauthorized");
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const totalProducts = await db.select().from(products);
    const totalOrders = await db.select().from(orders);
    const totalUsers = await db.select().from(users);

    return {
      totalProducts: totalProducts.length,
      totalOrders: totalOrders.length,
      totalUsers: totalUsers.length,
      recentOrders: totalOrders.slice(-5),
    };
  }),

  // Get all products for admin
  listProducts: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
        categoryId: z.number().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const where = input.categoryId
        ? eq(products.categoryId, input.categoryId)
        : undefined;

      return db
        .select()
        .from(products)
        .where(where)
        .orderBy(desc(products.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  // Get product by ID for editing
  getProduct: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const result = await db
        .select()
        .from(products)
        .where(eq(products.id, input.id))
        .limit(1);

      return result[0] || null;
    }),

  // Create product
  createProduct: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        categoryId: z.number(),
        price: z.number().positive(),
        sku: z.string().min(1),
        status: z.enum(["active", "inactive"]).default("active"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return db.insert(products).values({
        name: input.name,
        slug: input.slug,
        description: input.description,
        categoryId: input.categoryId,
        price: input.price.toString() as any,
        sku: input.sku,
        isActive: input.status === "active",
      });
    }),

  // Update product
  updateProduct: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        price: z.number().optional(),
        status: z.enum(["active", "inactive"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updateData: any = {};

      if (input.name !== undefined) updateData.name = input.name;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.price !== undefined) updateData.price = input.price.toString() as any;
      if (input.status !== undefined) updateData.isActive = input.status === "active";

      return db.update(products).set(updateData).where(eq(products.id, input.id));
    }),

  // Delete product
  deleteProduct: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return db
        .update(products)
        .set({ isActive: false })
        .where(eq(products.id, input.id));
    }),

  // Get all orders for admin
  listOrders: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
        status: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return db
        .select()
        .from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(input.limit)
        .offset(input.offset);
    }),

  // Update order status
  updateOrderStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum([
          "pending",
          "confirmed",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
          "refunded",
        ]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      return db
        .update(orders)
        .set({ status: input.status })
        .where(eq(orders.id, input.id));
    }),
});
