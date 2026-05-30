import { useEffect, useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Heart, ShoppingBag, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { user } = useAuth();
  const [scrollY, setScrollY] = useState(0);

  // Fetch featured products
  const { data: featuredProducts, isLoading: featuredLoading } =
    trpc.products.getFeatured.useQuery({ limit: 6 });

  // Fetch best sellers
  const { data: bestSellers, isLoading: bestSellersLoading } =
    trpc.products.getBestSellers.useQuery({ limit: 6 });

  // Fetch banners
  const { data: banners, isLoading: bannersLoading } =
    trpc.banners.getActive.useQuery({ limit: 5 });

  // Fetch categories
  const { data: categories } = trpc.categories.getAll.useQuery();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <a className="flex items-center gap-2 text-2xl font-bold text-accent">
              <Sparkles className="w-6 h-6" />
              Asel Ipek
            </a>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products">
              <a className="text-foreground hover:text-accent transition-colors">
                المنتجات
              </a>
            </Link>
            <Link href="/categories">
              <a className="text-foreground hover:text-accent transition-colors">
                الفئات
              </a>
            </Link>
            <Link href="/about">
              <a className="text-foreground hover:text-accent transition-colors">
                عن الماركة
              </a>
            </Link>
            <Link href="/contact">
              <a className="text-foreground hover:text-accent transition-colors">
                تواصل معنا
              </a>
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/cart">
              <a className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </a>
            </Link>
            {user ? (
              <Link href="/account">
                <a className="px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors">
                  حسابي
                </a>
              </Link>
            ) : (
              <Button variant="default" size="sm">
                دخول
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-background via-card to-background overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            y: scrollY * 0.5,
          }}
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl opacity-20" />
        </motion.div>

        <div className="container relative h-full flex items-center justify-center">
          <motion.div
            className="text-center max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
              أناقة بلا حدود
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              اكتشفي مجموعتنا الفاخرة من الملابس والأزياء المصممة بعناية فائقة
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/products">
                <a className="btn-luxury">
                  تسوقي الآن
                </a>
              </Link>
              <Link href="/about">
                <a className="btn-luxury-outline">
                  تعرفي علينا
                </a>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      {categories && categories.length > 0 && (
        <section className="section-padding bg-card">
          <div className="container">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 } as any}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                استكشفي الفئات
              </h2>
              <p className="text-muted-foreground">
                تصفحي أحدث المجموعات والتشكيلات
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {categories.slice(0, 3).map((category) => (
                <motion.div key={category.id} variants={itemVariants}>
                  <Link href={`/category/${category.slug}`}>
                    <a className="group card-luxury overflow-hidden h-64 flex flex-col items-center justify-center p-6 hover:shadow-luxury-lg transition-luxury">
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-24 h-24 object-cover mb-4 group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                      <h3 className="text-xl font-semibold text-center">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 text-center">
                        {category.description}
                      </p>
                    </a>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="section-padding">
        <div className="container">
          <motion.div
            className="flex items-center justify-between mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 } as any}
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">
                المنتجات المميزة
              </h2>
              <p className="text-muted-foreground mt-2">
                اختيارنا الخاص من أفضل القطع
              </p>
            </div>
            <Link href="/products?featured=true">
              <a className="flex items-center gap-2 text-accent hover:gap-3 transition-all">
                عرض الكل
                <ChevronRight className="w-5 h-5" />
              </a>
            </Link>
          </motion.div>

          {featuredLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-lg" />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {featuredProducts?.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="section-padding bg-card">
        <div className="container">
          <motion.div
            className="flex items-center justify-between mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 } as any}
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">
                الأكثر مبيعاً
              </h2>
              <p className="text-muted-foreground mt-2">
                المفضلة لدى عملائنا
              </p>
            </div>
            <Link href="/products?bestseller=true">
              <a className="flex items-center gap-2 text-accent hover:gap-3 transition-all">
                عرض الكل
                <ChevronRight className="w-5 h-5" />
              </a>
            </Link>
          </motion.div>

          {bestSellersLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80 rounded-lg" />
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {bestSellers?.map((product) => (
                <motion.div key={product.id} variants={itemVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-accent to-accent/80">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 } as any}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-accent-foreground mb-4">
              اشتركي في نشرتنا البريدية
            </h2>
            <p className="text-accent-foreground/80 mb-6">
              احصلي على أحدث العروض والمنتجات الجديدة مباشرة في بريدك الإلكتروني
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 px-4 py-3 rounded-lg bg-accent-foreground text-accent placeholder-accent/50 focus:outline-none"
              />
              <Button className="bg-accent-foreground text-accent hover:bg-accent-foreground/90">
                اشتركي
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                Asel Ipek
              </h3>
              <p className="text-sm text-muted-foreground">
                متجر أزياء فاخر متخصص في الملابس والإكسسوارات الراقية
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">الروابط السريعة</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/products">
                    <a className="text-muted-foreground hover:text-accent">
                      المنتجات
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/about">
                    <a className="text-muted-foreground hover:text-accent">
                      عن الماركة
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <a className="text-muted-foreground hover:text-accent">
                      تواصل معنا
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">المساعدة</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-accent">
                    سياسة الشحن
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-accent">
                    سياسة الاسترجاع
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-accent">
                    الأسئلة الشائعة
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">تابعينا</h4>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-accent">
                  Instagram
                </a>
                <a href="#" className="text-muted-foreground hover:text-accent">
                  Facebook
                </a>
                <a href="#" className="text-muted-foreground hover:text-accent">
                  Twitter
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Asel Ipek. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <Link href={`/product/${product.slug}`}>
      <a className="card-luxury overflow-hidden group h-full flex flex-col">
        <div className="relative overflow-hidden bg-muted h-64">
          <img
            src={product.images?.[0]?.url || "/placeholder.jpg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            {product.isFeatured && (
              <span className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                مميز
              </span>
            )}
            {product.originalPrice && (
              <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-semibold">
                خصم
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsWishlisted(!isWishlisted);
            }}
            className="absolute top-4 left-4 p-2 bg-card rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Heart
              className="w-5 h-5"
              fill={isWishlisted ? "currentColor" : "none"}
            />
          </button>
        </div>
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
            {product.shortDescription}
          </p>
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-2">
                <span className="text-xl font-bold text-accent">
                  {product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {product.originalPrice}
                  </span>
                )}
              </div>
            </div>
            {product.rating && (
              <div className="flex items-center gap-1 text-sm">
                <span className="text-accent">★</span>
                <span className="font-semibold">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({product.reviewCount})
                </span>
              </div>
            )}
          </div>
        </div>
      </a>
    </Link>
  );
}
