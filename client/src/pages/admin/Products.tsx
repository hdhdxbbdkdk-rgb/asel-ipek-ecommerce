import { useState } from "react";
import { Link } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  MoreVertical,
} from "lucide-react";
import { motion } from "framer-motion";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
  image: string;
  createdAt: string;
}

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [products, setProducts] = useState<Product[]>([
    {
      id: 1,
      name: "فستان سهرة فاخر",
      category: "فساتين",
      price: 450,
      stock: 15,
      status: "active",
      image: "dress1.jpg",
      createdAt: "2026-05-20",
    },
    {
      id: 2,
      name: "جاكيت جلد أنيق",
      category: "جاكيتات",
      price: 650,
      stock: 8,
      status: "active",
      image: "jacket1.jpg",
      createdAt: "2026-05-18",
    },
    {
      id: 3,
      name: "حقيبة يد فاخرة",
      category: "حقائب",
      price: 600,
      stock: 0,
      status: "inactive",
      image: "bag1.jpg",
      createdAt: "2026-05-15",
    },
  ]);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.id.toString().includes(searchTerm);
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: number) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  const categories = [
    "فساتين",
    "جاكيتات",
    "حقائب",
    "أحذية",
    "إكسسوارات",
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div>
            <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
            <p className="text-muted-foreground mt-2">
              إدارة جميع منتجات المتجر
            </p>
          </div>
          <Link href="/admin/products/new">
            <a>
              <Button className="btn-luxury flex items-center gap-2">
                <Plus className="w-5 h-5" />
                منتج جديد
              </Button>
            </a>
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="card-luxury p-6 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحثي عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent appearance-none bg-background"
              >
                <option value="all">جميع الفئات</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-end">
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} منتج
              </p>
            </div>
          </div>
        </motion.div>

        {/* Products Table */}
        <motion.div
          className="card-luxury overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {filteredProducts.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground mb-4">لا توجد منتجات</p>
              <Link href="/admin/products/new">
                <a className="inline-block px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90">
                  إضافة منتج جديد
                </a>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-right py-4 px-6">المنتج</th>
                    <th className="text-right py-4 px-6">الفئة</th>
                    <th className="text-right py-4 px-6">السعر</th>
                    <th className="text-right py-4 px-6">المخزون</th>
                    <th className="text-right py-4 px-6">الحالة</th>
                    <th className="text-right py-4 px-6">التاريخ</th>
                    <th className="text-right py-4 px-6">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-10 h-10 object-cover rounded"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect fill='%23e5e7eb' width='100' height='100'/%3E%3C/svg%3E";
                              }}
                            />
                          </div>
                          <span className="font-semibold">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">{product.category}</td>
                      <td className="py-4 px-6 font-bold text-accent">
                        {product.price} ر.س
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            product.stock > 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            product.status === "active"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {product.status === "active" ? "نشط" : "معطل"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {product.createdAt}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            <a className="p-2 hover:bg-muted rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </a>
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
}
