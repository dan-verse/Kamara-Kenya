"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Plus, Package, TrendingUp, DollarSign, Star, X } from "lucide-react";
import { useAuthStore, useStore } from "@/lib/store";

const categories = ["Sofas", "Tables", "Chairs", "Storage", "Beds"];

export default function VendorPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { products, orders, addProduct } = useStore();

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "Sofas",
    description: "",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
  });

  const vendorProducts = useMemo(() => {
    return products.filter(
      (p) => p.vendorId === user?.id || p.vendor === user?.name
    );
  }, [products, user]);

  const vendorOrders = useMemo(() => {
    return orders.filter((order) =>
      order.items.some((item) => item.vendor === user?.name)
    );
  }, [orders, user]);

  const totalRevenue = useMemo(() => {
    return vendorOrders.reduce((sum, order) => sum + order.total, 0);
  }, [vendorOrders]);

  if (!user || user.role !== "vendor") {
    return (
      <div className="text-center py-16">
        <Package size={64} className="mx-auto text-gray-400 mb-4" />
        <p className="text-xl text-gray-600 mb-4">Vendor access required</p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Go Home
        </button>
      </div>
    );
  }

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProduct({
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      description: newProduct.description,
      image: newProduct.image,
      vendor: user.name,
      vendorId: user.id,
    });
    setShowAddProduct(false);
    setNewProduct({
      name: "",
      price: "",
      category: "Sofas",
      description: "",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <button
          onClick={() => setShowAddProduct(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition inline-flex items-center gap-2"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Package className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600">Products</p>
              <p className="text-3xl font-bold">{vendorProducts.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600">Orders</p>
              <p className="text-3xl font-bold">{vendorOrders.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <DollarSign className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600">Revenue</p>
              <p className="text-3xl font-bold">${totalRevenue.toFixed(0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add New Product</h2>
              <button
                onClick={() => setShowAddProduct(false)}
                className="p-2 hover:bg-gray-100 rounded-xl"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Modern Leather Sofa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, price: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="999.99"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  required
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Premium quality furniture with..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={newProduct.image}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, image: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
              >
                Add Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">My Products</h2>
        {vendorProducts.length === 0 ? (
          <div className="text-center py-8">
            <Package size={48} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">
              No products yet. Add your first product!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {vendorProducts.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 p-4 border border-gray-200 rounded-xl"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-gray-600 text-sm">{product.category}</p>
                  <p className="font-bold text-lg mt-1">${product.price}</p>
                </div>
                <div className="flex flex-col justify-between items-end">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.inStock
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
                  <div className="flex items-center gap-1 text-sm">
                    <Star
                      size={16}
                      className="fill-yellow-400 text-yellow-400"
                    />
                    <span>
                      {product.rating || 0} ({product.reviews || 0})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        {vendorOrders.length === 0 ? (
          <div className="text-center py-8">
            <Package size={48} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-600">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {vendorOrders.map((order) => (
              <div
                key={order.id}
                className="p-4 border border-gray-200 rounded-xl"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">Order #{order.id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {order.status}
                  </span>
                </div>
                <div className="space-y-2">
                  {order.items
                    .filter((item) => item.vendor === user?.name)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
