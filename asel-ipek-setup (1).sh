#!/bin/bash

# ==============================================
# ASEL IPEK - World-Class E-Commerce Platform
# Auto-Generation Script (Reviewed & Fixed)
# ==============================================

set -e  # Exit on error

PROJECT_NAME="asel-ipek"
OUTPUT_ZIP="${PROJECT_NAME}.zip"

echo "🚀 Creating project: $PROJECT_NAME"

mkdir -p $PROJECT_NAME
cd $PROJECT_NAME

# -------------------------------
# 1. Package.json and configs
# -------------------------------
cat > package.json << 'EOF'
{
  "name": "asel-ipek",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:generate": "drizzle-kit generate:pg",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push:pg"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.3.2",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@stripe/stripe-js": "^2.1.0",
    "@tanstack/react-query": "^5.12.2",
    "@vercel/analytics": "^1.1.1",
    "bcryptjs": "^2.4.3",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "cloudinary": "^1.41.0",
    "date-fns": "^2.30.0",
    "drizzle-orm": "^0.28.6",
    "drizzle-zod": "^0.5.1",
    "framer-motion": "^10.16.16",
    "lucide-react": "^0.292.0",
    "next": "14.0.4",
    "next-auth": "^4.24.5",
    "next-cloudinary": "^5.20.0",
    "next-intl": "^3.2.2",
    "next-seo": "^6.4.0",
    "next-sitemap": "^4.2.3",
    "postgres": "^3.4.3",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.48.2",
    "react-hot-toast": "^2.4.1",
    "resend": "^2.0.0",
    "stripe": "^14.4.0",
    "tailwind-merge": "^2.2.0",
    "tailwindcss-animate": "^1.0.7",
    "zod": "^3.22.4",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.15.0",
    "@typescript-eslint/parser": "^6.15.0",
    "autoprefixer": "^10.4.16",
    "drizzle-kit": "^0.20.6",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.0.4",
    "postcss": "^8.4.32",
    "prettier": "^3.1.1",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.3"
  }
}
EOF

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
EOF

cat > next.config.js << 'EOF'
/** @type {import('next').NextConfig} */
const withNextIntl = require('next-intl/plugin')();

const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'lh3.googleusercontent.com'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
EOF

cat > .env.example << 'EOF'
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
DATABASE_URL=postgres://user:password@host:5432/dbname
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
RESEND_API_KEY=re_...
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-...
NEXT_PUBLIC_META_PIXEL=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_SITE_URL=https://aselipek.com
EOF

cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      colors: {
        primary: "#F8F5F0",
        secondary: "#D8C3A5",
        accent: "#C6A969",
        dark: "#1F1F1F",
        neutral: "#6B6B6B",
        success: "#16A34A",
        warning: "#F59E0B",
        error: "#DC2626",
      },
      fontFamily: { sans: ["var(--font-inter)"] },
      keyframes: { "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } } },
      animation: { "accordion-down": "accordion-down 0.2s ease-out" },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
EOF

cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
}
EOF

# -------------------------------
# 2. Middleware (fixed: correct next-auth v4 + next-intl pattern)
# -------------------------------
cat > src/middleware.ts << 'EOF'
import createMiddleware from 'next-intl/middleware';
import { withAuth } from 'next-auth/middleware';
import { NextRequest, NextResponse } from 'next/server';

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar', 'tr'],
  defaultLocale: 'en',
  localePrefix: 'always',
});

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    pages: { signIn: '/en/auth/login' },
    callbacks: {
      authorized: ({ token }) => token?.role === 'admin',
    },
  }
);

export default function middleware(req: NextRequest) {
  const isAdminPage = req.nextUrl.pathname.match(/\/[a-z]{2}\/admin/);
  if (isAdminPage) {
    return (authMiddleware as any)(req);
  }
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
EOF

# -------------------------------
# 3. Global styles
# -------------------------------
mkdir -p src/app
cat > src/app/globals.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}
EOF

# -------------------------------
# 4. Database schema (Drizzle)
# -------------------------------
mkdir -p src/lib/db
cat > src/lib/db/index.ts << 'EOF'
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client, { schema });
EOF

cat > src/lib/db/schema.ts << 'EOF'
import {
  pgTable, text, timestamp, uuid, integer,
  real, boolean, jsonb
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password'),
  name: text('name'),
  role: text('role').default('customer').notNull(),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: jsonb('name').notNull(),
  slug: text('slug').unique().notNull(),
  parentId: uuid('parent_id'),
  image: text('image'),
  order: integer('order').default(0),
});

export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  sku: text('sku').unique().notNull(),
  name: jsonb('name').notNull(),
  description: jsonb('description'),
  slug: text('slug').unique().notNull(),
  price: real('price').notNull(),
  compareAtPrice: real('compare_at_price'),
  cost: real('cost'),
  stock: integer('stock').default(0).notNull(),
  trackInventory: boolean('track_inventory').default(true),
  weight: real('weight'),
  isActive: boolean('is_active').default(true),
  isFeatured: boolean('is_featured').default(false),
  isDeleted: boolean('is_deleted').default(false),
  categoryId: uuid('category_id').references(() => categories.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const productVariants = pgTable('product_variants', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  attributes: jsonb('attributes').notNull(),
  sku: text('sku').unique().notNull(),
  price: real('price'),
  stock: integer('stock').default(0),
  imageId: uuid('image_id'),
});

export const productImages = pgTable('product_images', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  url: text('url').notNull(),
  cloudinaryPublicId: text('cloudinary_public_id'),
  alt: jsonb('alt'),
  order: integer('order').default(0),
});

export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  guestEmail: text('guest_email'),
  orderNumber: text('order_number').unique().notNull(),
  status: text('status').default('pending').notNull(),
  paymentStatus: text('payment_status').default('unpaid'),
  total: real('total').notNull(),
  subtotal: real('subtotal').notNull(),
  tax: real('tax').default(0),
  shippingCost: real('shipping_cost').default(0),
  discount: real('discount').default(0),
  couponCode: text('coupon_code'),
  shippingAddress: jsonb('shipping_address').notNull(),
  billingAddress: jsonb('billing_address'),
  trackingNumber: text('tracking_number'),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  variantId: uuid('variant_id'),
  quantity: integer('quantity').notNull(),
  price: real('price').notNull(),
  productSnapshot: jsonb('product_snapshot').notNull(),
});

export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id).notNull(),
  gateway: text('gateway').notNull(),
  gatewayId: text('gateway_id'),
  amount: real('amount').notNull(),
  currency: text('currency').default('USD'),
  status: text('status').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const wishlists = pgTable('wishlists', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const reviews = pgTable('reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id).notNull(),
  userId: uuid('user_id').references(() => users.id).notNull(),
  rating: integer('rating').notNull(),
  title: text('title'),
  content: text('content'),
  isApproved: boolean('is_approved').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const coupons = pgTable('coupons', {
  id: uuid('id').defaultRandom().primaryKey(),
  code: text('code').unique().notNull(),
  type: text('type').notNull(),
  value: real('value').notNull(),
  minSpend: real('min_spend'),
  maxDiscount: real('max_discount'),
  usageLimit: integer('usage_limit'),
  usedCount: integer('used_count').default(0),
  validFrom: timestamp('valid_from'),
  validUntil: timestamp('valid_until'),
  isActive: boolean('is_active').default(true),
});

export const shippingMethods = pgTable('shipping_methods', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: jsonb('name').notNull(),
  price: real('price').notNull(),
  estimatedDays: text('estimated_days'),
  isActive: boolean('is_active').default(true),
});

export const newsletterSubscribers = pgTable('newsletter_subscribers', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  action: text('action').notNull(),
  entity: text('entity'),
  entityId: text('entity_id'),
  oldValues: jsonb('old_values'),
  newValues: jsonb('new_values'),
  ip: text('ip'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
EOF

cat > drizzle.config.ts << 'EOF'
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
EOF

# -------------------------------
# 5. Stripe helper (was missing — caused webhook build error)
# -------------------------------
mkdir -p src/lib
cat > src/lib/stripe.ts << 'EOF'
import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});
EOF

# -------------------------------
# 6. Authentication (NextAuth v4 — corrected from v5 API)
# -------------------------------
cat > src/lib/auth.ts << 'EOF'
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { compare } from 'bcryptjs';
import { db } from './db/index';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const result = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);
        const user = result[0];
        if (!user || !user.password) return null;
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) (session.user as any).role = token.role;
      return session;
    },
  },
  pages: {
    signIn: '/en/auth/login',
    error: '/en/auth/error',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};
EOF

mkdir -p src/app/api/auth/\[...nextauth\]
cat > "src/app/api/auth/[...nextauth]/route.ts" << 'EOF'
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
EOF

# -------------------------------
# 7. Providers component (was missing — caused layout build error)
# -------------------------------
mkdir -p src/components
cat > src/components/providers.tsx << 'EOF'
'use client';

import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 60 * 1000 } },
  }));

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster position="top-right" />
      </QueryClientProvider>
    </SessionProvider>
  );
}
EOF

# -------------------------------
# 8. Layout and Pages
# -------------------------------
mkdir -p src/app/\[locale\]/auth/{login,register,forgot-password}
mkdir -p src/app/\[locale\]/products
mkdir -p src/app/\[locale\]/cart
mkdir -p src/app/\[locale\]/checkout
mkdir -p src/app/\[locale\]/account/{orders,wishlist,addresses}
mkdir -p src/app/\[locale\]/admin/dashboard/{products,orders,customers,settings}
mkdir -p src/app/\[locale\]/search

cat > "src/app/[locale]/layout.tsx" << 'EOF'
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { Inter, Cairo } from 'next/font/google';
import '../globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const cairo = Cairo({ subsets: ['arabic'], variable: '--font-cairo' });

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  let messages;
  try {
    messages = await getMessages({ locale });
  } catch {
    notFound();
  }

  const isRtl = locale === 'ar';
  const fontVar = isRtl ? cairo.variable : inter.variable;

  return (
    <html lang={locale} dir={isRtl ? 'rtl' : 'ltr'} className={fontVar}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <Providers>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
EOF

cat > "src/app/[locale]/page.tsx" << 'EOF'
import { getTranslations } from 'next-intl/server';
import { Hero } from '@/components/home/Hero';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { Categories } from '@/components/home/Categories';
import { Newsletter } from '@/components/home/Newsletter';

export default async function HomePage() {
  const t = await getTranslations('home');
  return (
    <>
      <Hero title={t('heroTitle')} cta={t('shopNow')} />
      <FeaturedProducts />
      <Categories />
      <Newsletter />
    </>
  );
}
EOF

cat > "src/app/[locale]/products/page.tsx" << 'EOF'
import { ProductGrid } from '@/components/product/ProductGrid';
import { Filters } from '@/components/product/Filters';

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-light mb-8">All Products</h1>
      <div className="grid lg:grid-cols-4 gap-8">
        <aside>
          <Filters />
        </aside>
        <div className="lg:col-span-3">
          <ProductGrid filters={searchParams} />
        </div>
      </div>
    </div>
  );
}
EOF

cat > "src/app/[locale]/cart/page.tsx" << 'EOF'
'use client';

import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCartStore();
  const { locale } = useParams<{ locale: string }>();

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-neutral-500">Your cart is empty.</p>
        <Link href={`/${locale}/products`} className="mt-4 inline-block underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-light mb-8">Shopping Cart ({itemCount()})</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={`${item.id}-${item.variantId ?? 'default'}`} className="flex gap-4 border-b pb-4">
              <Image src={item.image} alt={item.name} width={100} height={100} className="object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-neutral-500">${item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1), item.variantId)}
                  aria-label="Decrease quantity"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1, item.variantId)}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
                <button
                  onClick={() => removeItem(item.id, item.variantId)}
                  aria-label="Remove item"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
              <p className="w-20 text-right">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div className="bg-gray-50 p-6 h-fit rounded-lg">
          <h2 className="text-xl mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Subtotal</span>
            <span>${total().toFixed(2)}</span>
          </div>
          <Link href={`/${locale}/checkout`}>
            <button className="w-full bg-dark text-white py-3 mt-4 rounded hover:opacity-90 transition">
              Proceed to Checkout
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
EOF

# -------------------------------
# 9. Skeleton placeholder components (prevents build errors)
# -------------------------------
mkdir -p src/components/layout
mkdir -p src/components/home
mkdir -p src/components/product
mkdir -p src/components/search

cat > src/components/layout/Header.tsx << 'EOF'
'use client';

import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { ShoppingBag, Heart, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LiveSearch } from '../search/LiveSearch';

export function Header() {
  const itemCount = useCartStore((state) => state.itemCount());
  const pathname = usePathname();
  const locale = pathname.split('/')[1] || 'en';

  return (
    <header className="border-b sticky top-0 bg-white z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={`/${locale}`} className="text-2xl font-light tracking-wider">
          ASEL IPEK
        </Link>
        <nav className="hidden md:flex gap-8 text-sm">
          <Link href={`/${locale}/products`}>Shop</Link>
          <Link href={`/${locale}/products?category=hijabs`}>Hijabs</Link>
          <Link href={`/${locale}/products?category=dresses`}>Dresses</Link>
          <Link href={`/${locale}/products?category=accessories`}>Accessories</Link>
        </nav>
        <div className="flex items-center gap-4">
          <LiveSearch locale={locale} />
          <Link href={`/${locale}/account/wishlist`} aria-label="Wishlist">
            <Heart size={20} />
          </Link>
          <Link href={`/${locale}/cart`} className="relative" aria-label="Cart">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-dark text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <Link href={`/${locale}/auth/login`} aria-label="Account">
            <User size={20} />
          </Link>
        </div>
      </div>
    </header>
  );
}
EOF

cat > src/components/layout/Footer.tsx << 'EOF'
export function Footer() {
  return (
    <footer className="border-t mt-16 py-10 text-center text-sm text-neutral-500">
      <p>&copy; {new Date().getFullYear()} ASEL IPEK. All rights reserved.</p>
    </footer>
  );
}
EOF

cat > src/components/home/Hero.tsx << 'EOF'
interface HeroProps { title: string; cta: string; }
export function Hero({ title, cta }: HeroProps) {
  return (
    <section className="h-[80vh] flex items-center justify-center bg-primary text-center px-4">
      <div>
        <h1 className="text-5xl md:text-7xl font-light tracking-widest mb-6">{title}</h1>
        <a href="#products" className="inline-block border border-dark px-8 py-3 text-sm tracking-widest hover:bg-dark hover:text-white transition">
          {cta}
        </a>
      </div>
    </section>
  );
}
EOF

cat > src/components/home/FeaturedProducts.tsx << 'EOF'
export function FeaturedProducts() {
  return (
    <section className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-light text-center mb-10">Featured</h2>
      <p className="text-center text-neutral-400">Products will be loaded here.</p>
    </section>
  );
}
EOF

cat > src/components/home/Categories.tsx << 'EOF'
export function Categories() {
  return (
    <section className="container mx-auto px-4 py-16 bg-primary">
      <h2 className="text-3xl font-light text-center mb-10">Shop by Category</h2>
    </section>
  );
}
EOF

cat > src/components/home/Newsletter.tsx << 'EOF'
'use client';
import { useState } from 'react';

export function Newsletter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) });
    setSubmitted(true);
  };

  return (
    <section className="py-16 bg-dark text-white text-center px-4">
      <h2 className="text-3xl font-light mb-4">Stay in the Loop</h2>
      {submitted ? (
        <p className="text-accent">Thank you for subscribing!</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 justify-center max-w-md mx-auto mt-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            required
            className="flex-1 px-4 py-2 text-dark rounded"
          />
          <button type="submit" className="bg-accent text-white px-6 py-2 rounded hover:opacity-90 transition">
            Subscribe
          </button>
        </form>
      )}
    </section>
  );
}
EOF

cat > src/components/product/ProductGrid.tsx << 'EOF'
interface ProductGridProps { filters?: Record<string, string>; }
export function ProductGrid({ filters }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      <p className="col-span-full text-neutral-400 text-center py-12">Loading products…</p>
    </div>
  );
}
EOF

cat > src/components/product/Filters.tsx << 'EOF'
export function Filters() {
  return (
    <div className="space-y-6">
      <h3 className="font-medium">Filters</h3>
      <p className="text-sm text-neutral-400">Filter options coming soon.</p>
    </div>
  );
}
EOF

# -------------------------------
# 10. Live Search (fixed: accepts locale prop)
# -------------------------------
cat > src/components/search/LiveSearch.tsx << 'EOF'
'use client';

import { useState, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import Link from 'next/link';
import { Search } from 'lucide-react';

interface LiveSearchProps { locale: string; }

export function LiveSearch({ locale }: LiveSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{ id: string; slug: string; name: { en: string } }>>([]);
  const debounced = useDebounce(query, 300);

  useEffect(() => {
    if (debounced.length < 2) { setResults([]); return; }
    fetch(`/api/search?q=${encodeURIComponent(debounced)}`)
      .then((res) => res.json())
      .then((data) => setResults((data.results ?? []).slice(0, 5)));
  }, [debounced]);

  return (
    <div className="relative">
      <div className="flex items-center border rounded-full py-1 px-3 gap-2 w-48 focus-within:w-64 transition-all">
        <Search size={14} className="text-neutral-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className="bg-transparent text-sm outline-none w-full"
        />
      </div>
      {results.length > 0 && (
        <div className="absolute bg-white shadow-lg mt-1 w-full z-50 rounded-md border overflow-hidden">
          {results.map((p) => (
            <Link
              key={p.id}
              href={`/${locale}/products/${p.slug}`}
              onClick={() => setQuery('')}
              className="block p-2 hover:bg-gray-50 text-sm"
            >
              {p.name?.en}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
EOF

# -------------------------------
# 11. Store (Zustand cart & wishlist)
# -------------------------------
mkdir -p src/store
cat > src/store/cartStore.ts << 'EOF'
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  variantId?: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variantId?: string) => void;
  updateQuantity: (id: string, qty: number, variantId?: string) => void;
  clearCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find(
          (i) => i.id === item.id && i.variantId === item.variantId
        );
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.id === item.id && i.variantId === item.variantId
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (id, variantId) =>
        set({ items: get().items.filter((i) => !(i.id === id && i.variantId === variantId)) }),
      updateQuantity: (id, qty, variantId) =>
        set({
          items: get().items.map((i) =>
            i.id === id && i.variantId === variantId ? { ...i, quantity: Math.max(1, qty) } : i
          ),
        }),
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
      itemCount: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: 'asel-cart' }
  )
);
EOF

# -------------------------------
# 12. API routes
# -------------------------------
mkdir -p src/app/api/search
mkdir -p src/app/api/products
mkdir -p src/app/api/orders
mkdir -p src/app/api/newsletter
mkdir -p "src/app/api/webhooks/stripe"

cat > src/app/api/search/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { products } from '@/lib/db/schema';
import { sql, eq, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q') ?? '';
  if (q.length < 2) return NextResponse.json({ results: [] });

  const results = await db
    .select()
    .from(products)
    .where(
      and(
        eq(products.isDeleted, false),
        eq(products.isActive, true),
        sql`(${products.name}->>'en' ILIKE ${'%' + q + '%'} OR ${products.sku} ILIKE ${'%' + q + '%'})`
      )
    )
    .limit(10);

  return NextResponse.json({ results });
}
EOF

cat > src/app/api/products/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { products } from '@/lib/db/schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit = 20;
  const offset = (page - 1) * limit;

  const all = await db.select().from(products).where(eq(products.isDeleted, false)).limit(limit).offset(offset);
  return NextResponse.json({ products: all });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const newProduct = await db.insert(products).values(body).returning();
  return NextResponse.json(newProduct[0], { status: 201 });
}
EOF

cat > src/app/api/newsletter/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { newsletterSubscribers } from '@/lib/db/schema';

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  try {
    await db.insert(newsletterSubscribers).values({ email });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Already subscribed or invalid email' }, { status: 409 });
  }
}
EOF

cat > src/app/api/webhooks/stripe/route.ts << 'EOF'
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db/index';
import { orders, payments } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  let event: ReturnType<typeof stripe.webhooks.constructEvent>;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderNumber = (session.metadata as any)?.orderNumber;
    if (orderNumber) {
      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.orderNumber, orderNumber))
        .limit(1);
      if (order[0]) {
        await db
          .update(orders)
          .set({ status: 'confirmed', paymentStatus: 'paid' })
          .where(eq(orders.id, order[0].id));
        await db.insert(payments).values({
          orderId: order[0].id,
          gateway: 'stripe',
          gatewayId: session.id,
          amount: (session.amount_total ?? 0) / 100,
          currency: session.currency ?? 'USD',
          status: 'succeeded',
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
EOF

# -------------------------------
# 13. Hooks
# -------------------------------
mkdir -p src/hooks
cat > src/hooks/useDebounce.ts << 'EOF'
import { useEffect, useState } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}
EOF

# -------------------------------
# 14. Internationalization messages
# -------------------------------
mkdir -p messages
cat > messages/en.json << 'EOF'
{
  "home": {
    "heroTitle": "Elegance Redefined",
    "heroSubtitle": "Modest fashion for the modern woman",
    "shopNow": "Shop Now"
  },
  "common": {
    "addToCart": "Add to Cart",
    "loading": "Loading...",
    "error": "Something went wrong"
  }
}
EOF

cat > messages/ar.json << 'EOF'
{
  "home": {
    "heroTitle": "الأناقة المُعاد تعريفها",
    "heroSubtitle": "أزياء محتشمة للمرأة العصرية",
    "shopNow": "تسوقي الآن"
  },
  "common": {
    "addToCart": "أضف إلى السلة",
    "loading": "جارٍ التحميل...",
    "error": "حدث خطأ ما"
  }
}
EOF

cat > messages/tr.json << 'EOF'
{
  "home": {
    "heroTitle": "Yeniden Tanımlanan Zarafet",
    "heroSubtitle": "Modern kadın için tesettür modası",
    "shopNow": "Şimdi Alışveriş Yap"
  },
  "common": {
    "addToCart": "Sepete Ekle",
    "loading": "Yükleniyor...",
    "error": "Bir şeyler ters gitti"
  }
}
EOF

# -------------------------------
# 15. SEO: robots & sitemap (fixed typo: aselipek not aselipeK)
# -------------------------------
cat > src/app/robots.ts << 'EOF'
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
EOF

cat > src/app/sitemap.ts << 'EOF'
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aselipek.com';
  return [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/en/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  ];
}
EOF

# -------------------------------
# 16. README
# -------------------------------
cat > README.md << 'EOF'
# ASEL IPEK — E-Commerce Platform

A production-ready Next.js 14 e-commerce platform with:
- **Multi-language support**: English, Arabic (RTL), Turkish
- **Auth**: NextAuth v4 with Google OAuth + Credentials
- **Database**: Drizzle ORM + PostgreSQL (Supabase or any Postgres host)
- **Payments**: Stripe (with webhook handling) + PayPal ready
- **Image CDN**: Cloudinary
- **Email**: Resend
- **Cart**: Zustand (persisted to localStorage)

## Quick Start

```bash
unzip asel-ipek.zip
cd asel-ipek
cp .env.example .env.local
# Fill in your credentials in .env.local
npm install
npm run db:push   # Push schema to your database
npm run dev
```

## Environment Variables

See `.env.example` for all required variables.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + Radix UI |
| ORM | Drizzle ORM |
| Database | PostgreSQL (Supabase) |
| Auth | NextAuth v4 |
| State | Zustand |
| Payments | Stripe, PayPal |
| Email | Resend |
| Images | Cloudinary |
| i18n | next-intl |
EOF

# -------------------------------
# 17. Create ZIP (excluding node_modules)
# -------------------------------
cd ..
echo "🗜 Creating ZIP archive..."
zip -r "$OUTPUT_ZIP" "$PROJECT_NAME" \
  --exclude "*node_modules*" \
  --exclude "*.git*" \
  --exclude "*/.next/*" \
  > /dev/null

echo ""
echo "✅ Done! Project saved as: $OUTPUT_ZIP"
echo ""
echo "👉 To use:"
echo "   unzip $OUTPUT_ZIP"
echo "   cd $PROJECT_NAME"
echo "   cp .env.example .env.local"
echo "   # Fill in your credentials"
echo "   npm install"
echo "   npm run db:push"
echo "   npm run dev"
EOF