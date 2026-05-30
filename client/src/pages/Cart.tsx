import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, Minus, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "فستان سهرة فاخر",
      price: "450.00 ر.س",
      image: "/placeholder.jpg",
      quantity: 1,
      size: "M",
      color: "أسود",
    },
    {
      id: 2,
      name: "جاكيت جلد أنيق",
      price: "650.00 ر.س",
      image: "/placeholder.jpg",
      quantity: 2,
      size: "L",
      color: "بني",
    },
  ]);

  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );
  const discount = discountApplied ? subtotal * 0.1 : 0;
  const shipping = 50;
  const total = subtotal - discount + shipping;

  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleUpdateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setDiscountApplied(true);
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
          <Link href="/products">
            <a className="flex items-center gap-2 text-foreground hover:text-accent">
              <ChevronLeft className="w-5 h-5" />
              العودة للتسوق
            </a>
          </Link>
        </div>
      </header>

      <div className="container py-8">
        <motion.h1
          className="text-4xl font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          سلة التسوق
        </motion.h1>

        {cartItems.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xl text-muted-foreground mb-6">
              سلتك فارغة حالياً
            </p>
            <Link href="/products">
              <a className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors">
                ابدئي التسوق
              </a>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div
              className="lg:col-span-2 space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="card-luxury p-4 flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.size && `المقاس: ${item.size}`}
                      {item.color && ` • اللون: ${item.color}`}
                    </p>
                    <p className="font-bold text-accent">{item.price}</p>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2 border border-border rounded-lg">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 hover:bg-muted"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 hover:bg-muted"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Order Summary */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="card-luxury p-6 sticky top-24">
                <h2 className="text-xl font-bold mb-6">ملخص الطلب</h2>

                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">المجموع الجزئي</span>
                    <span className="font-semibold">
                      {subtotal.toFixed(2)} ر.س
                    </span>
                  </div>
                  {discountApplied && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>الخصم (10%)</span>
                      <span>-{discount.toFixed(2)} ر.س</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">الشحن</span>
                    <span className="font-semibold">{shipping.toFixed(2)} ر.س</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>الإجمالي</span>
                  <span className="text-accent">{total.toFixed(2)} ر.س</span>
                </div>

                {/* Coupon */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
                    كود الخصم
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="أدخلي الكود"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                    <Button
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={discountApplied}
                    >
                      تطبيق
                    </Button>
                  </div>
                </div>

                {/* Checkout */}
                <Link href="/checkout">
                  <a className="w-full block px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors text-center font-semibold mb-3">
                    المتابعة للدفع
                  </a>
                </Link>

                <Link href="/products">
                  <a className="w-full block px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors text-center font-semibold">
                    متابعة التسوق
                  </a>
                </Link>

                {/* Security Badge */}
                <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
                  <p>🔒 عملية دفع آمنة وموثوقة</p>
                </div>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
