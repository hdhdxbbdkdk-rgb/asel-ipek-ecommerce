import { useState } from "react";
import { useLocation } from "wouter";
import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive";
  images: string[];
  variants: Array<{
    type: string;
    values: string[];
  }>;
}

export default function ProductForm() {
  const [location] = useLocation();
  const isEdit = location.includes("/edit");

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    category: "",
    price: 0,
    stock: 0,
    status: "active",
    images: [],
    variants: [],
  });

  const [newVariant, setNewVariant] = useState({ type: "", values: "" });

  const categories = [
    "فساتين",
    "جاكيتات",
    "حقائب",
    "أحذية",
    "إكسسوارات",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number(value) : value,
    }));
  };

  const handleAddVariant = () => {
    if (newVariant.type && newVariant.values) {
      setFormData((prev) => ({
        ...prev,
        variants: [
          ...prev.variants,
          {
            type: newVariant.type,
            values: newVariant.values.split(",").map((v) => v.trim()),
          },
        ],
      }));
      setNewVariant({ type: "", values: "" });
    }
  };

  const handleRemoveVariant = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Product data:", formData);
    alert("تم حفظ المنتج بنجاح!");
  };

  return (
    <AdminLayout>
      <motion.div
        className="max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {isEdit ? "تعديل المنتج" : "إضافة منتج جديد"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEdit
              ? "قم بتعديل معلومات المنتج"
              : "أضف منتج جديد إلى المتجر"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card className="card-luxury p-6">
            <h2 className="text-xl font-bold mb-6">المعلومات الأساسية</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  اسم المنتج
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="أدخلي اسم المنتج"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  الوصف
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="أدخلي وصف المنتج"
                  rows={5}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    الفئة
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent appearance-none bg-background"
                    required
                  >
                    <option value="">اختاري الفئة</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    الحالة
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent appearance-none bg-background"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">معطل</option>
                  </select>
                </div>
              </div>
            </div>
          </Card>

          {/* Pricing & Inventory */}
          <Card className="card-luxury p-6">
            <h2 className="text-xl font-bold mb-6">السعر والمخزون</h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  السعر (ر.س)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  الكمية المتاحة
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  required
                />
              </div>
            </div>
          </Card>

          {/* Images */}
          <Card className="card-luxury p-6">
            <h2 className="text-xl font-bold mb-6">الصور</h2>

            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="font-semibold mb-1">اسحبي الصور هنا</p>
              <p className="text-sm text-muted-foreground">
                أو انقري لاختيار الملفات
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
              />
            </div>

            {formData.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-6">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          images: prev.images.filter((_, i) => i !== index),
                        }))
                      }
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Variants */}
          <Card className="card-luxury p-6">
            <h2 className="text-xl font-bold mb-6">الخيارات (المقاسات، الألوان)</h2>

            <div className="space-y-4">
              {formData.variants.map((variant, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <div>
                    <p className="font-semibold">{variant.type}</p>
                    <p className="text-sm text-muted-foreground">
                      {variant.values.join(", ")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(index)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-colors text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    نوع الخيار
                  </label>
                  <input
                    type="text"
                    value={newVariant.type}
                    onChange={(e) =>
                      setNewVariant((prev) => ({
                        ...prev,
                        type: e.target.value,
                      }))
                    }
                    placeholder="مثال: المقاس، اللون"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    القيم (مفصولة بفواصل)
                  </label>
                  <input
                    type="text"
                    value={newVariant.values}
                    onChange={(e) =>
                      setNewVariant((prev) => ({
                        ...prev,
                        values: e.target.value,
                      }))
                    }
                    placeholder="مثال: S, M, L, XL"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddVariant}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  إضافة خيار
                </Button>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" className="flex-1 btn-luxury">
              {isEdit ? "حفظ التعديلات" : "إضافة المنتج"}
            </Button>
            <Button type="button" variant="outline" className="flex-1">
              إلغاء
            </Button>
          </div>
        </form>
      </motion.div>
    </AdminLayout>
  );
}
