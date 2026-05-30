import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user is admin
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">الوصول مرفوض</h1>
          <p className="text-muted-foreground mb-6">
            أنت لا تملك صلاحيات الوصول إلى لوحة التحكم الإدارية
          </p>
          <Link href="/">
            <a className="inline-block px-6 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90">
              العودة للمتجر
            </a>
          </Link>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: "لوحة التحكم",
      href: "/admin",
    },
    {
      icon: Package,
      label: "المنتجات",
      href: "/admin/products",
    },
    {
      icon: ShoppingCart,
      label: "الطلبات",
      href: "/admin/orders",
    },
    {
      icon: Users,
      label: "المستخدمون",
      href: "/admin/users",
    },
    {
      icon: BarChart3,
      label: "التحليلات",
      href: "/admin/analytics",
    },
    {
      icon: Settings,
      label: "الإعدادات",
      href: "/admin/settings",
    },
  ];

  const isActive = (href: string) => {
    return location === href || location.startsWith(href + "/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-card border-b border-border">
        <div className="flex items-center justify-between h-16 px-4">
          <Link href="/">
            <a className="text-xl font-bold text-accent">Asel Ipek</a>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-muted rounded-lg"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className="border-t border-border bg-card"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <nav className="space-y-1 p-4">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </a>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </div>

      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <motion.aside
          className="hidden lg:flex flex-col w-64 bg-card border-r border-border"
          animate={{ width: sidebarOpen ? 256 : 80 }}
          transition={{ duration: 0.3 }}
        >
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b border-border">
            <Link href="/">
              <a className="text-xl font-bold text-accent">
                {sidebarOpen ? "Asel Ipek" : "A"}
              </a>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-foreground hover:bg-muted"
                  }`}
                  title={!sidebarOpen ? item.label : ""}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm">{item.label}</span>}
                </a>
              </Link>
            ))}
          </nav>

          {/* User Profile */}
          <div className="border-t border-border p-4 space-y-3">
            <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center"}`}>
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-semibold">
                {user?.name?.charAt(0) || "A"}
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    مسؤول
                  </p>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="w-full"
            >
              <LogOut className="w-4 h-4" />
              {sidebarOpen && "تسجيل الخروج"}
            </Button>
          </div>

          {/* Collapse Button */}
          <div className="border-t border-border p-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full p-2 hover:bg-muted rounded-lg transition-colors"
              title={sidebarOpen ? "إغلاق" : "فتح"}
            >
              <ChevronDown
                className={`w-5 h-5 mx-auto transition-transform ${
                  !sidebarOpen ? "rotate-90" : "-rotate-90"
                }`}
              />
            </button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            className="p-4 lg:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
