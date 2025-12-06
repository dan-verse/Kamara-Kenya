"use client";

import Link from "next/link";
import { ArrowRight, Package, Shield, Truck, HeadphonesIcon } from "lucide-react";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

const categories = [
  {
    name: "Living Room",
    description: "Create space for comfort",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
    href: "/shop?category=Sofas",
  },
  {
    name: "Dining Room",
    description: "Gather around style",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop",
    href: "/shop?category=Tables",
  },
  {
    name: "Bedroom",
    description: "Rest in elegance",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
    href: "/shop?category=Beds",
  },
  {
    name: "Workspace",
    description: "Create productivity",
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800&h=600&fit=crop",
    href: "/shop?category=Chairs",
  },
];

const features = [
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Free shipping on orders over $500",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure transactions",
  },
  {
    icon: Package,
    title: "Easy Returns",
    description: "30-day return policy",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    description: "Dedicated customer service",
  },
];

export default function HomePage() {
  const products = useStore((state) => state.products);
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gray-900">
        <img
          src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1600&h=900&fit=crop"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 
          flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-light text-white mb-6 leading-tight">
              Where Every Space<br />
              <span className="font-semibold">Tells Your Story</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Discover timeless furniture pieces that transform your house into a home
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 
                font-medium hover:bg-gray-100 transition-colors group"
            >
              Shop Collection
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Shop by <span className="font-semibold">Category</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated collections designed for every room in your home
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group relative h-80 overflow-hidden"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover 
                    group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-light mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-200 mb-4">{category.description}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium 
                    group-hover:gap-3 transition-all">
                    Shop Now
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-2">
                Featured <span className="font-semibold">Products</span>
              </h2>
              <p className="text-gray-600">Handpicked pieces for your home</p>
            </div>
            <Link
              href="/shop"
              className="text-sm font-medium text-gray-900 hover:text-gray-600 
                transition-colors flex items-center gap-2 group"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 
                    bg-gray-50 rounded-full mb-4">
                    <Icon className="w-8 h-8 text-gray-900" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-light mb-4">
            Stay <span className="font-semibold">Connected</span>
          </h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">
            Get the latest updates on new products, special offers, and design inspiration
          </p>
          <form className="max-w-md mx-auto flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 
                text-white placeholder-gray-400 focus:outline-none focus:border-white 
                transition-colors"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-white text-gray-900 font-medium 
                hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}