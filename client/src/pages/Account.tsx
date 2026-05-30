import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Package, MapPin, LogOut, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

interface Order {
  id: string;
  date: string;
  total: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
  items: number;
}

interface SavedAddress {
  id: number;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export default function Account() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("orders");

  const orders: Order[] = [
    {
      id: "ORD-001",
      date: "2026-05-20",
      total: 1250,
      status: "delivered",
      items: 3,
    },
    {
      id: "ORD-002",
      date: "2026-05-15",
      total: 890,
      status: "shipped",
      items: 2,
    },
    {
      id: "ORD-003",
      date: "2026-05-10",
      total: 450,
      status: "delivered",
      items: 1,
    },
  ];

  const addresses: SavedAddress[] = [
    {
      id: 1,
      name: "عنواني الرئيسي",
      phone: "+966501234567",
      street: "شارع النيل، الحي الخاص",
      city: "الرياض",
      state: "منطقة الرياض",
      zip: "12345",
      isDefault: true,
    },
    {
      id: 2,
      name: "عنوان العمل",
      phone: "+966509876543",
      street: "شارع التجارة، البرج الذهبي",
      city: "جدة",
      state: "منطقة مكة",
      zip: "21432",
      isDefault: false,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-600";
      case "shipped":
        return "text-blue-600";
      case "pending":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "تم التسليم";
      case "shipped":
        return "قيد الشحن";
      case "pending":
        return "قيد المعالجة";
      case "cancelled":
        return "ملغى";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <a className="text-2xl font-bold text-accent">Asel Ipek</a>
          </Link>
          <Link href="/">
            <a className="flex items-center gap-2 text-foreground hover:text-accent">
              <ChevronLeft className="w-5 h-5" />
              العودة للمتجر
            </a>
          </Link>
        </div>
      </header>

      <div className="container py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="mb-8">
            <div className="card-luxury p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-accent-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{user?.name}</h1>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                الطلبات
              </TabsTrigger>
              <TabsTrigger value="addresses" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                العناوين
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                الملف الشخصي
              </TabsTrigger>
            </TabsList>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-6">سجل الطلبات</h2>

                {orders.length === 0 ? (
                  <Card className="card-luxury p-8 text-center">
                    <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      لم تقومي بأي طلبات حتى الآن
                    </p>
                    <Link href="/products">
                      <a className="inline-block px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90">
                        ابدئي التسوق
                      </a>
                    </Link>
                  </Card>
                ) : (
                  orders.map((order, index) => (
                    <motion.div
                      key={order.id}
                      className="card-luxury p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            رقم الطلب
                          </p>
                          <p className="font-semibold">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            التاريخ
                          </p>
                          <p className="font-semibold">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            الحالة
                          </p>
                          <p
                            className={`font-semibold ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {getStatusText(order.status)}
                          </p>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">
                              الإجمالي
                            </p>
                            <p className="text-lg font-bold text-accent">
                              {order.total} ر.س
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            عرض التفاصيل
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </motion.div>
            </TabsContent>

            {/* Addresses Tab */}
            <TabsContent value="addresses">
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">العناوين المحفوظة</h2>
                  <Button className="btn-luxury">إضافة عنوان جديد</Button>
                </div>

                {addresses.map((address, index) => (
                  <motion.div
                    key={address.id}
                    className="card-luxury p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">
                          {address.name}
                        </h3>
                        {address.isDefault && (
                          <span className="inline-block px-2 py-1 bg-accent/10 text-accent text-xs font-semibold rounded">
                            العنوان الافتراضي
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          تعديل
                        </Button>
                        <Button variant="outline" size="sm">
                          حذف
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {address.street}
                      </p>
                      <p>
                        {address.city}، {address.state} {address.zip}
                      </p>
                      <p>{address.phone}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold mb-6">معلومات الملف الشخصي</h2>

                <Card className="card-luxury p-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        الاسم الكامل
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name || ""}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email || ""}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        placeholder="+966501234567"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <div className="pt-4">
                      <Button className="btn-luxury">حفظ التغييرات</Button>
                    </div>
                  </div>
                </Card>

                {/* Change Password */}
                <Card className="card-luxury p-6">
                  <h3 className="text-lg font-semibold mb-4">تغيير كلمة المرور</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        كلمة المرور الحالية
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        كلمة المرور الجديدة
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        تأكيد كلمة المرور
                      </label>
                      <input
                        type="password"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>

                    <div className="pt-4">
                      <Button className="btn-luxury">تحديث كلمة المرور</Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
