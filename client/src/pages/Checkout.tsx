import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, MapPin, Truck, CreditCard } from "lucide-react";
import { motion } from "framer-motion";

interface Address {
  id: number;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  days: string;
}

export default function Checkout() {
  const [step, setStep] = useState<"address" | "shipping" | "payment">(
    "address"
  );
  const [selectedAddress, setSelectedAddress] = useState<number | null>(1);
  const [selectedShipping, setSelectedShipping] = useState<string>("standard");
  const [paymentMethod, setPaymentMethod] = useState<
    "card" | "paypal" | "cod"
  >("card");

  const addresses: Address[] = [
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

  const shippingMethods: ShippingMethod[] = [
    {
      id: "standard",
      name: "الشحن العادي",
      price: 50,
      days: "3-5 أيام عمل",
    },
    {
      id: "express",
      name: "الشحن السريع",
      price: 100,
      days: "1-2 يوم عمل",
    },
    {
      id: "overnight",
      name: "الشحن الفوري",
      price: 200,
      days: "نفس اليوم",
    },
  ];

  const orderTotal = 1150;
  const selectedShippingPrice =
    shippingMethods.find((m) => m.id === selectedShipping)?.price || 50;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container flex items-center justify-between h-16">
          <Link href="/">
            <a className="text-2xl font-bold text-accent">Asel Ipek</a>
          </Link>
          <Link href="/cart">
            <a className="flex items-center gap-2 text-foreground hover:text-accent">
              <ChevronLeft className="w-5 h-5" />
              العودة للسلة
            </a>
          </Link>
        </div>
      </header>

      <div className="container py-8">
        {/* Progress Steps */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            {["address", "shipping", "payment"].map((s, index) => (
              <div key={s} className="flex items-center">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step === s
                      ? "bg-accent text-accent-foreground"
                      : step === "payment" && s !== "payment"
                      ? "bg-green-600 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                  whileHover={{ scale: 1.1 }}
                >
                  {index + 1}
                </motion.div>
                {index < 2 && (
                  <div
                    className={`w-12 h-1 mx-2 transition-colors ${
                      step === "payment"
                        ? "bg-green-600"
                        : step === "shipping" && s === "address"
                        ? "bg-accent"
                        : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>العنوان</span>
            <span>الشحن</span>
            <span>الدفع</span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Address Selection */}
            {step === "address" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">اختاري عنوان التسليم</h2>

                <div className="space-y-4">
                  {addresses.map((address) => (
                    <motion.div
                      key={address.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedAddress === address.id
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      }`}
                      onClick={() => setSelectedAddress(address.id)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress === address.id}
                          onChange={() => setSelectedAddress(address.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">
                            {address.name}
                          </h3>
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
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  className="w-full btn-luxury"
                  onClick={() => setStep("shipping")}
                >
                  المتابعة لاختيار الشحن
                </Button>
              </div>
            )}

            {/* Shipping Selection */}
            {step === "shipping" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">اختاري طريقة الشحن</h2>

                <div className="space-y-4">
                  {shippingMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedShipping === method.id
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      }`}
                      onClick={() => setSelectedShipping(method.id)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          name="shipping"
                          checked={selectedShipping === method.id}
                          onChange={() => setSelectedShipping(method.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold flex items-center gap-2">
                              <Truck className="w-5 h-5" />
                              {method.name}
                            </h3>
                            <span className="text-lg font-bold text-accent">
                              {method.price} ر.س
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {method.days}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("address")}
                  >
                    السابق
                  </Button>
                  <Button
                    className="flex-1 btn-luxury"
                    onClick={() => setStep("payment")}
                  >
                    المتابعة للدفع
                  </Button>
                </div>
              </div>
            )}

            {/* Payment Selection */}
            {step === "payment" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">اختاري طريقة الدفع</h2>

                <div className="space-y-4">
                  {[
                    {
                      id: "card",
                      name: "بطاقة ائتمان",
                      icon: CreditCard,
                      description: "فيزا أو ماستركارد",
                    },
                    {
                      id: "paypal",
                      name: "PayPal",
                      icon: CreditCard,
                      description: "الدفع عبر PayPal",
                    },
                    {
                      id: "cod",
                      name: "الدفع عند الاستلام",
                      icon: Truck,
                      description: "ادفعي عند استقبال الطلب",
                    },
                  ].map((method: any) => (
                    <motion.div
                      key={method.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      }`}
                      onClick={() =>
                        setPaymentMethod(method.id as "card" | "paypal" | "cod")
                      }
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === method.id}
                          onChange={() =>
                            setPaymentMethod(
                              method.id as "card" | "paypal" | "cod"
                            )
                          }
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold flex items-center gap-2 mb-1">
                            <method.icon className="w-5 h-5" />
                            {method.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <motion.div
                    className="space-y-4 p-4 bg-muted rounded-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        رقم البطاقة
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          تاريخ الانتهاء
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep("shipping")}
                  >
                    السابق
                  </Button>
                  <Button className="flex-1 btn-luxury">
                    إكمال الطلب
                  </Button>
                </div>
              </div>
            )}
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

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">المجموع الجزئي</span>
                  <span className="font-semibold">1000 ر.س</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الشحن</span>
                  <span className="font-semibold">
                    {selectedShippingPrice} ر.س
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>الإجمالي</span>
                <span className="text-accent">
                  {orderTotal + selectedShippingPrice} ر.س
                </span>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-6 pb-6 border-t border-border pt-6">
                <h3 className="font-semibold mb-3">المنتجات</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>فستان سهرة فاخر × 1</span>
                    <span>450 ر.س</span>
                  </div>
                  <div className="flex justify-between">
                    <span>جاكيت جلد أنيق × 2</span>
                    <span>1300 ر.س</span>
                  </div>
                </div>
              </div>

              {/* Security Badge */}
              <div className="text-center text-xs text-muted-foreground">
                <p>🔒 عملية دفع آمنة وموثوقة</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
