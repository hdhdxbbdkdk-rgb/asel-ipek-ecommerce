import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ChevronDown, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function Products() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("newest");
  const [offset, setOffset] = useState(0);
  const limit = 12;

  // Fetch categories
  const { data: categories } = trpc.categories.getAll.useQuery();

  // Fetch products based on search
  const { data: searchResults, isLoading: searchLoading } =
    trpc.products.search.useQuery(
      { query: searchQuery, limit, offset },
      { enabled: searchQuery.length > 0 }
    );

  // Fetch products by category
  const { data: categoryResults, isLoading: categoryLoading } =
    trpc.products.getByCategory.useQuery(
      { categoryId: selectedCategory || 1, limit, offset },
      { enabled: selectedCategory !== null }
    );

  const isLoading = searchLoading || categoryLoading;
  const products = searchQuery ? searchResults?.products : categoryResults?.products || [];

  const handleSort = (value: string) => {
    setSortBy(value);
    // Sort products based on selected option
    // This would typically be done on the server side
  };

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setSearchQuery("");
    setOffset(0);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <a className="text-2xl font-bold text-accent">Asel Ipek</a>
          </Link>
          <nav className="hidden md:flex gap-8">
            <Link href="/products">
              <a className="text-foreground hover:text-accent">المنتجات</a>
            </Link>
            <Link href="/">
              <a className="text-foreground hover:text-accent">الرئيسية</a>
            </Link>
          </nav>
          <Link href="/cart">
            <a className="px-4 py-2 bg-accent text-accent-foreground rounded-lg">
              السلة
            </a>
          </Link>
        </div>
      </header>

      <div className="container py-8">
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4">المنتجات</h1>
          <p className="text-muted-foreground">
            اكتشفي مجموعتنا الكاملة من الملابس والأزياء الفاخرة
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <motion.div
            className="lg:col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-xl font-bold mb-6">الفلترة</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  بحث
                </label>
                <div className="relative">
                  <Search className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="ابحثي عن منتج..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setOffset(0);
                    }}
                    className="w-full pl-3 pr-10 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3">
                  الفئات
                </label>
                <div className="space-y-2">
                  {categories?.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)}
                      className={`w-full text-right px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? "bg-accent text-accent-foreground"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  الترتيب
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="newest">الأحدث</option>
                  <option value="price-low">السعر: من الأقل للأعلى</option>
                  <option value="price-high">السعر: من الأعلى للأقل</option>
                  <option value="popular">الأكثر شهرة</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Products Grid */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                  <Skeleton key={i} className="h-80 rounded-lg" />
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="col-span-3 text-center py-12">
                <p className="text-muted-foreground text-lg">
                  لم نجد أي منتجات مطابقة لبحثك
                </p>
              </div>
            )}

            {/* Pagination */}
            {products && products.length > 0 && (
              <div className="flex justify-center gap-4 mt-12">
                <Button
                  variant="outline"
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0}
                >
                  السابق
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setOffset(offset + limit)}
                  disabled={products.length < limit}
                >
                  التالي
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
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
