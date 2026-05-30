import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminRouter } from "./routers/admin";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getDb,
  getProductBySlug,
  getProductById,
  getFeaturedProducts,
  getBestSellerProducts,
  searchProducts,
  getProductsByCategory,
  getProductImages,
  getProductVariants,
  getProductReviews,
  getAllCategories,
  getCategoryBySlug,
  getUserOrders,
  getOrderById,
  getOrderItems,
  getCouponByCode,
  getUserAddresses,
  getDefaultAddress,
  getShippingMethods,
  getActiveBanners,
  getTranslationsByLanguage,
  createContactMessage,
} from "./db";
import { products, categories, productImages, productVariants, inventory, orders, orderItems, payments, addresses, coupons, shippingMethods, banners } from "../drizzle/schema";
import { eq, and, desc, asc } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,
  admin: adminRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Products Router
  products: router({
    // Get featured products
    getFeatured: publicProcedure
      .input(z.object({ limit: z.number().default(6) }))
      .query(async ({ input }) => {
        return getFeaturedProducts(input.limit);
      }),

    // Get best sellers
    getBestSellers: publicProcedure
      .input(z.object({ limit: z.number().default(6) }))
      .query(async ({ input }) => {
        return getBestSellerProducts(input.limit);
      }),

    // Search products
    search: publicProcedure
      .input(
        z.object({
          query: z.string(),
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return searchProducts(input.query, input.limit, input.offset);
      }),

    // Get products by category
    getByCategory: publicProcedure
      .input(
        z.object({
          categoryId: z.number(),
          limit: z.number().default(20),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return getProductsByCategory(input.categoryId, input.limit, input.offset);
      }),

    // Get product by slug
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const product = await getProductBySlug(input.slug);
        if (!product) return null;

        const images = await getProductImages(product.id);
        const variants = await getProductVariants(product.id);
        const reviews = await getProductReviews(product.id);

        return {
          ...product,
          images,
          variants,
          reviews,
        };
      }),

    // Get product by ID
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await getProductById(input.id);
        if (!product) return null;

        const images = await getProductImages(product.id);
        const variants = await getProductVariants(product.id);
        const reviews = await getProductReviews(product.id);

        return {
          ...product,
          images,
          variants,
          reviews,
        };
      }),

    // Admin: Create product
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          slug: z.string(),
          description: z.string().optional(),
          shortDescription: z.string().optional(),
          categoryId: z.number(),
          price: z.string(),
          originalPrice: z.string().optional(),
          sku: z.string(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const result = await db.insert(products).values({
          name: input.name,
          slug: input.slug,
          description: input.description,
          shortDescription: input.shortDescription,
          categoryId: input.categoryId,
          price: input.price as any,
          originalPrice: input.originalPrice as any,
          sku: input.sku,
          isActive: true,
        });

        return result;
      }),

    // Admin: Update product
    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          price: z.string().optional(),
          isFeatured: z.boolean().optional(),
          isBestSeller: z.boolean().optional(),
          isActive: z.boolean().optional(),
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
        if (input.price !== undefined) updateData.price = input.price;
        if (input.isFeatured !== undefined) updateData.isFeatured = input.isFeatured;
        if (input.isBestSeller !== undefined) updateData.isBestSeller = input.isBestSeller;
        if (input.isActive !== undefined) updateData.isActive = input.isActive;

        return db.update(products).set(updateData).where(eq(products.id, input.id));
      }),

    // Admin: Delete product
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        return db.update(products).set({ isActive: false }).where(eq(products.id, input.id));
      }),
  }),

  // Categories Router
  categories: router({
    // Get all categories
    getAll: publicProcedure.query(async () => {
      return getAllCategories();
    }),

    // Get category by slug
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        return getCategoryBySlug(input.slug);
      }),

    // Admin: Create category
    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          slug: z.string(),
          description: z.string().optional(),
          image: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        return db.insert(categories).values({
          name: input.name,
          slug: input.slug,
          description: input.description,
          image: input.image,
          isActive: true,
        });
      }),
  }),

  // Orders Router
  orders: router({
    // Get user orders
    getMyOrders: protectedProcedure
      .input(z.object({ limit: z.number().default(10), offset: z.number().default(0) }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Unauthorized");
        return getUserOrders(ctx.user.id, input.limit, input.offset);
      }),

    // Get order details
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Unauthorized");

        const order = await getOrderById(input.id);
        if (!order || order.userId !== ctx.user.id) {
          throw new Error("Unauthorized");
        }

        const items = await getOrderItems(input.id);
        return { ...order, items };
      }),

    // Admin: Get all orders
    getAll: protectedProcedure
      .input(z.object({ limit: z.number().default(20), offset: z.number().default(0) }))
      .query(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        const results = await db
          .select()
          .from(orders)
          .orderBy(desc(orders.createdAt))
          .limit(input.limit)
          .offset(input.offset);

        return results;
      }),

    // Admin: Update order status
    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded"]),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        return db.update(orders).set({ status: input.status }).where(eq(orders.id, input.id));
      }),
  }),

  // Coupons Router
  coupons: router({
    // Validate coupon
    validate: publicProcedure
      .input(z.object({ code: z.string() }))
      .query(async ({ input }) => {
        const coupon = await getCouponByCode(input.code);
        if (!coupon) return null;

        const now = new Date();
        if (coupon.validFrom && coupon.validFrom > now) return null;
        if (coupon.validUntil && coupon.validUntil < now) return null;
        if (coupon.maxUsageCount && (coupon.usageCount ?? 0) >= coupon.maxUsageCount) return null;

        return coupon;
      }),
  }),

  // Addresses Router
  addresses: router({
    // Get user addresses
    getMyAddresses: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      return getUserAddresses(ctx.user.id);
    }),

    // Get default address
    getDefault: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) throw new Error("Unauthorized");
      return getDefaultAddress(ctx.user.id);
    }),

    // Create address
    create: protectedProcedure
      .input(
        z.object({
          type: z.enum(["billing", "shipping", "both"]),
          fullName: z.string(),
          phone: z.string(),
          street: z.string(),
          city: z.string(),
          state: z.string().optional(),
          postalCode: z.string(),
          country: z.string(),
          isDefault: z.boolean().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (!ctx.user) throw new Error("Unauthorized");

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        return db.insert(addresses).values({
          userId: ctx.user.id,
          type: input.type,
          fullName: input.fullName,
          phone: input.phone,
          street: input.street,
          city: input.city,
          state: input.state,
          postalCode: input.postalCode,
          country: input.country,
          isDefault: input.isDefault || false,
        });
      }),
  }),

  // Shipping Router
  shipping: router({
    // Get shipping methods
    getMethods: publicProcedure.query(async () => {
      return getShippingMethods();
    }),
  }),

  // Banners Router
  banners: router({
    // Get active banners
    getActive: publicProcedure
      .input(z.object({ limit: z.number().default(5) }))
      .query(async ({ input }) => {
        return getActiveBanners(input.limit);
      }),

    // Admin: Create banner
    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          image: z.string(),
          link: z.string().optional(),
          displayOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized");
        }

        const db = await getDb();
        if (!db) throw new Error("Database not available");

        return db.insert(banners).values({
          title: input.title,
          description: input.description,
          image: input.image,
          link: input.link,
          displayOrder: input.displayOrder,
          isActive: true,
        });
      }),
  }),

  // Contact Router
  contact: router({
    // Submit contact message
    submit: publicProcedure
      .input(
        z.object({
          name: z.string(),
          email: z.string().email(),
          subject: z.string(),
          message: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        return createContactMessage(input);
      }),
  }),

  // Localization Router
  localization: router({
    // Get translations by language
    getTranslations: publicProcedure
      .input(z.object({ language: z.string() }))
      .query(async ({ input }) => {
        const translations = await getTranslationsByLanguage(input.language);
        const result: Record<string, string> = {};
        translations.forEach((t) => {
          result[t.key] = t.value;
        });
        return result;
      }),
  }),
});

export type AppRouter = typeof appRouter;
