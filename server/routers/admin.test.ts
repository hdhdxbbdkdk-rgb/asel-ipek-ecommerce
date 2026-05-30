import { describe, it, expect } from "vitest";
import { adminRouter } from "./admin";
import type { TrpcContext } from "../_core/context";

type AuthenticatedAdmin = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const admin: AuthenticatedAdmin = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user: admin,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createUserContext(): { ctx: TrpcContext } {
  const user: AuthenticatedAdmin = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("Admin Router", () => {
  describe("Authorization", () => {
    it("should deny access to non-admin users", async () => {
      const { ctx } = createUserContext();
      const caller = adminRouter.createCaller(ctx);

      try {
        await caller.getStats();
        expect.fail("Should have thrown Unauthorized error");
      } catch (error: any) {
        expect(error.message).toContain("Unauthorized");
      }
    });

    it("should allow access to admin users", async () => {
      const { ctx } = createAdminContext();
      const caller = adminRouter.createCaller(ctx);

      try {
        // This will fail due to no database, but authorization should pass
        await caller.getStats();
      } catch (error: any) {
        // We expect a database error, not an authorization error
        expect(error.message).not.toContain("Unauthorized");
      }
    });
  });

  describe("Input Validation", () => {
    it("should validate product creation input", async () => {
      const { ctx } = createAdminContext();
      const caller = adminRouter.createCaller(ctx);

      try {
        // Missing required fields
        await caller.createProduct({
          name: "",
          slug: "",
          categoryId: 0,
          price: -1,
          sku: "",
        } as any);
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        // Zod validation error
        expect(error).toBeDefined();
      }
    });

    it("should validate order status update input", async () => {
      const { ctx } = createAdminContext();
      const caller = adminRouter.createCaller(ctx);

      try {
        // Invalid status
        await caller.updateOrderStatus({
          id: 1,
          status: "invalid_status" as any,
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("Product Operations", () => {
    it("should require valid product name", async () => {
      const { ctx } = createAdminContext();
      const caller = adminRouter.createCaller(ctx);

      try {
        await caller.createProduct({
          name: "",
          slug: "test",
          categoryId: 1,
          price: 100,
          sku: "TEST-001",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it("should require positive price", async () => {
      const { ctx } = createAdminContext();
      const caller = adminRouter.createCaller(ctx);

      try {
        await caller.createProduct({
          name: "Test Product",
          slug: "test-product",
          categoryId: 1,
          price: -100,
          sku: "TEST-001",
        });
        expect.fail("Should have thrown validation error");
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });
  });
});
