import { motion } from "framer-motion";
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import {
  BarChart3,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Eye,
} from "lucide-react";
import { Link } from "wouter";

interface StatCard {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

export default function AdminDashboard() {
  const stats: StatCard[] = [
    {
      title: "إجمالي المبيعات",
      value: "45,230 ر.س",
      change: "+12.5%",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "text-green-600",
    },
    {
      title: "الطلبات",
      value: "128",
      change: "+8 اليوم",
      icon: <ShoppingCart className="w-6 h-6" />,
      color: "text-blue-600",
    },
    {
      title: "المنتجات",
      value: "342",
      change: "+5 جديد",
      icon: <Package className="w-6 h-6" />,
      color: "text-purple-600",
    },
    {
      title: "المستخدمون",
      value: "1,245",
      change: "+32 جديد",
      icon: <Users className="w-6 h-6" />,
      color: "text-orange-600",
    },
  ];

  const recentOrders = [
    {
      id: "ORD-001",
      customer: "فاطمة محمد",
      amount: "1,250 ر.س",
      status: "delivered",
      date: "2026-05-30",
    },
    {
      id: "ORD-002",
      customer: "نور أحمد",
      amount: "890 ر.س",
      status: "shipped",
      date: "2026-05-29",
    },
    {
      id: "ORD-003",
      customer: "ليلى علي",
      amount: "2,100 ر.س",
      status: "pending",
      date: "2026-05-29",
    },
  ];

  const topProducts = [
    { name: "فستان سهرة فاخر", sales: 145, revenue: "65,250 ر.س" },
    { name: "جاكيت جلد أنيق", sales: 98, revenue: "44,100 ر.س" },
    { name: "حقيبة يد فاخرة", sales: 87, revenue: "52,200 ر.س" },
    { name: "حذاء كلاسيكي", sales: 76, revenue: "38,000 ر.س" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "تم التسليم";
      case "shipped":
        return "قيد الشحن";
      case "pending":
        return "قيد الانتظار";
      default:
        return status;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground mt-2">
            مرحباً بك في لوحة التحكم الإدارية
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
            >
              <Card className="card-luxury p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-accent/10 ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {stat.change}
                  </span>
                </div>
                <h3 className="text-muted-foreground text-sm mb-2">
                  {stat.title}
                </h3>
                <p className="text-2xl font-bold">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts & Tables */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <Card className="card-luxury p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">الطلبات الأخيرة</h2>
                <Link href="/admin/orders">
                  <a className="text-sm text-accent hover:underline">
                    عرض الكل
                  </a>
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-right py-3 px-4">رقم الطلب</th>
                      <th className="text-right py-3 px-4">العميل</th>
                      <th className="text-right py-3 px-4">المبلغ</th>
                      <th className="text-right py-3 px-4">الحالة</th>
                      <th className="text-right py-3 px-4">التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-border hover:bg-muted/50"
                      >
                        <td className="py-3 px-4 font-semibold">{order.id}</td>
                        <td className="py-3 px-4">{order.customer}</td>
                        <td className="py-3 px-4">{order.amount}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusText(order.status)}
                          </span>
                        </td>
                        <td className="py-3 px-4">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Top Products */}
          <div>
            <Card className="card-luxury p-6">
              <h2 className="text-xl font-bold mb-6">أفضل المنتجات</h2>

              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.name}
                    className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.sales} عملية بيع
                      </p>
                      <p className="text-sm font-bold text-accent mt-1">
                        {product.revenue}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Link href="/admin/products/new">
            <a className="block">
              <Card className="card-luxury p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <Package className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-bold mb-2">إضافة منتج جديد</h3>
                <p className="text-sm text-muted-foreground">
                  أضف منتج جديد إلى المتجر
                </p>
              </Card>
            </a>
          </Link>

          <Link href="/admin/orders">
            <a className="block">
              <Card className="card-luxury p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <ShoppingCart className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-bold mb-2">إدارة الطلبات</h3>
                <p className="text-sm text-muted-foreground">
                  عرض وإدارة جميع الطلبات
                </p>
              </Card>
            </a>
          </Link>

          <Link href="/admin/analytics">
            <a className="block">
              <Card className="card-luxury p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <BarChart3 className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-bold mb-2">التحليلات</h3>
                <p className="text-sm text-muted-foreground">
                  عرض التقارير والإحصائيات
                </p>
              </Card>
            </a>
          </Link>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
