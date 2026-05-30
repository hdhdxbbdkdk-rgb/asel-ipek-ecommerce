import { eq, and, desc, asc, like, gte, lte, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  products,
  categories,
  productVariants,
  productImages,
  reviews,
  inventory,
  addresses,
  orders,
  orderItems,
  payments,
  coupons,
  shippingMethods,
  banners,
  contactMessages,
  translations,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phone"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Product functions
export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getFeaturedProducts(limit = 6) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(products)
    .where(and(eq(products.isFeatured, true), eq(products.isActive, true)))
    .limit(limit);
}

export async function getBestSellerProducts(limit = 6) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(products)
    .where(and(eq(products.isBestSeller, true), eq(products.isActive, true)))
    .limit(limit);
}

export async function searchProducts(
  query: string,
  limit = 20,
  offset = 0
) {
  const db = await getDb();
  if (!db) return { products: [], total: 0 };

  const searchQuery = `%${query}%`;
  const results = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isActive, true),
        like(products.name, searchQuery)
      )
    )
    .limit(limit)
    .offset(offset);

  return { products: results, total: results.length };
}

export async function getProductsByCategory(
  categoryId: number,
  limit = 20,
  offset = 0
) {
  const db = await getDb();
  if (!db) return { products: [], total: 0 };

  const results = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.categoryId, categoryId),
        eq(products.isActive, true)
      )
    )
    .limit(limit)
    .offset(offset);

  return { products: results, total: results.length };
}

export async function getProductImages(productId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, productId))
    .orderBy(asc(productImages.displayOrder));
}

export async function getProductVariants(productId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId));
}

export async function getProductReviews(productId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(reviews)
    .where(
      and(
        eq(reviews.productId, productId),
        eq(reviews.isApproved, true)
      )
    )
    .orderBy(desc(reviews.createdAt))
    .limit(limit);
}

// Category functions
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(categories)
    .where(eq(categories.isActive, true))
    .orderBy(asc(categories.name));
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(categories)
    .where(
      and(
        eq(categories.slug, slug),
        eq(categories.isActive, true)
      )
    )
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Order functions
export async function getUserOrders(userId: number, limit = 10, offset = 0) {
  const db = await getDb();
  if (!db) return { orders: [], total: 0 };

  const results = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt))
    .limit(limit)
    .offset(offset);

  return { orders: results, total: results.length };
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderByNumber(orderNumber: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(orders)
    .where(eq(orders.orderNumber, orderNumber))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));
}

// Coupon functions
export async function getCouponByCode(code: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(coupons)
    .where(
      and(
        eq(coupons.code, code),
        eq(coupons.isActive, true)
      )
    )
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Address functions
export async function getUserAddresses(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, userId))
    .orderBy(desc(addresses.isDefault));
}

export async function getDefaultAddress(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(addresses)
    .where(
      and(
        eq(addresses.userId, userId),
        eq(addresses.isDefault, true)
      )
    )
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Shipping methods
export async function getShippingMethods() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(shippingMethods)
    .where(eq(shippingMethods.isActive, true));
}

// Banners
export async function getActiveBanners(limit = 5) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(banners)
    .where(eq(banners.isActive, true))
    .orderBy(asc(banners.displayOrder))
    .limit(limit);
}

// Contact messages
export async function createContactMessage(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(contactMessages).values(data);
  return result;
}

// Translations
export async function getTranslation(key: string, language: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(translations)
    .where(
      and(
        eq(translations.key, key),
        eq(translations.language, language)
      )
    )
    .limit(1);
  return result.length > 0 ? result[0]?.value : undefined;
}

export async function getTranslationsByLanguage(language: string) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(translations)
    .where(eq(translations.language, language));
}
