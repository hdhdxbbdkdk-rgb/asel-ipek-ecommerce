import { useState } from "react";
import { Link } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Download,
  Search,
  Filter,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

interface Order {
  id: string;
  customer: string;
  email: string;
  amount: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  items: number;
  date: string;
}

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customer: "فاطمة محمد",
      email: "fatima@example.com",
      amount: 1250,
      status: "delivered",
      items: 3,
      date: "2026-05-30",
    },
    {
      id: "ORD-002",
      customer: "نور أحمد",
      email: "noor@example.com",
      amount: 890,
      status: "shipped",
      items: 2,
      date: "2026-05-29",
    },
    {
      id: "ORD-003",
      customer: "ليلى علي",
      email: "layla@example.com",
      amount: 2100,
      status: "pending",
      items: 4,
      date: "2026-05-29",
    },
    {
      id: "ORD-004",
      customer: "سارة خالد",
      email: "sarah@example.com",
      amount: 550,
      status: "cancelled",
      items: 1,
      date: "2026-05-28",
    },
  ]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
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
      case "cancelled":
        return "ملغى";
      default:
        return status;
    }
  };

  const stats = [
    { label: "إجمالي الطلبات", value: orders.length },
    {
      label: "قيد الانتظار",
      value: orders.filter((o) => o.status === "pending").length,
    },
    {
      label: "قيد الشحن",
      value: orders.filter((o) => o.status === "shipped").length,
    },
    {
      label: "تم التسليم",
      value: orders.filter((o) => o.status === "delivered").length,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold">إدارة الطلبات</h1>
          <p className="text-muted-foreground mt-2">
            إدارة وتتبع جميع طلبات العملاء
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className="card-luxury p-4 text-center">
                <p className="text-muted-foreground text-sm mb-2">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-accent">{stat.value}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters */}
        <motion.div
          className="card-luxury p-6 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="ابحثي عن طلب..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute right-3 top-3 w-5 h-5 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent appearance-none bg-background"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">قيد الانتظار</option>
                <option value="shipped">قيد الشحن</option>
                <option value="delivered">تم التسليم</option>
                <option value="cancelled">ملغى</option>
              </select>
            </div>

            {/* Export */}
            <div className="flex items-center justify-end">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                تصدير
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div
          className="card-luxury overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">لا توجد طلبات</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-right py-4 px-6">رقم الطلب</th>
                    <th className="text-right py-4 px-6">العميل</th>
                    <th className="text-right py-4 px-6">البريد</th>
                    <th className="text-right py-4 px-6">المبلغ</th>
                    <th className="text-right py-4 px-6">العناصر</th>
                    <th className="text-right py-4 px-6">الحالة</th>
                    <th className="text-right py-4 px-6">التاريخ</th>
                    <th className="text-right py-4 px-6">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <motion.tr
                      key={order.id}
                      className="border-b border-border hover:bg-muted/50 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td className="py-4 px-6 font-semibold">{order.id}</td>
                      <td className="py-4 px-6">{order.customer}</td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {order.email}
                      </td>
                      <td className="py-4 px-6 font-bold text-accent">
                        {order.amount} ر.س
                      </td>
                      <td className="py-4 px-6 text-center">{order.items}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusText(order.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-muted-foreground">
                        {order.date}
                      </td>
                      <td className="py-4 px-6">
                        <Link href={`/admin/orders/${order.id}`}>
                          <a className="inline-flex items-center gap-2 px-3 py-1 bg-accent/10 text-accent rounded-lg hover:bg-accent/20 transition-colors">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm">عرض</span>
                          </a>
                        </Link>
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
