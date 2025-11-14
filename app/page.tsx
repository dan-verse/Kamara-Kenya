"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

const categories = ["Sofas", "Tables", "Chairs", "Storage", "Beds"];

export default function HomePage() {
  const products = useStore((state) => state.products);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative h-96 rounded-3xl overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
          <div className="px-8 md:px-16 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Transform Your Space
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Discover premium furniture from top vendors
            </p>
            <Link
              href="/shop"
              className="px-8 py-4 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition inline-flex items-center gap-2"
            >
              Shop Now <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/shop?category=${category}`}
              className="p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition text-center"
            >
              <div className="text-3xl mb-2">
                {category === "Sofas" && "🛋️"}
                {category === "Tables" && "🪑"}
                {category === "Chairs" && "💺"}
                {category === "Storage" && "📦"}
                {category === "Beds" && "🛏️"}
              </div>
              <p className="font-medium">{category}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link
            href="/shop"
            className="text-blue-600 font-medium hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.slice(0, 6).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
