"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Grid3x3, LayoutList } from "lucide-react";
import { useStore } from "@/lib/store";
import ProductCard from "@/components/ProductCard";

const categories = ["All", "Sofas", "Tables", "Chairs", "Storage", "Beds"];
const sortOptions = [
  { label: "Featured", value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Newest", value: "newest" },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  const products = useStore((state) => state.products);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "All");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch = searchParam
        ? product.name.toLowerCase().includes(searchParam.toLowerCase()) ||
          product.vendor.toLowerCase().includes(searchParam.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchParam.toLowerCase())
        : true;
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort products
    switch (sortBy) {
      case "price-asc":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "newest":
        filtered = [...filtered].sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    return filtered;
  }, [products, searchParam, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-10 border-b border-gray-100 pb-8">
          {searchParam ? (
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Search Results</p>
              <h1 className="text-4xl font-light text-gray-900 mb-3">
                "{searchParam}"
              </h1>
            </div>
          ) : categoryParam && categoryParam !== "All" ? (
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Category</p>
              <h1 className="text-4xl font-light text-gray-900 mb-3">{categoryParam}</h1>
            </div>
          ) : (
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-3">Our Collection</h1>
              <p className="text-gray-600">Discover timeless pieces for every space</p>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-4">
            {filteredAndSortedProducts.length} Product{filteredAndSortedProducts.length !== 1 ? "s" : ""} Available
          </p>
        </div>

        {/* Filters & Controls */}
        <div className="mb-10">
          {/* Category Filter */}
          <div className="mb-6 pb-6 border-b border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-900 mr-2">Shop by Category:</span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-gray-900 text-white"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Sort & View Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm text-gray-900 bg-transparent border-b border-gray-300 
                  outline-none cursor-pointer font-medium py-1 hover:border-gray-900 
                  transition-colors"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1 border border-gray-200 p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition-colors ${
                  viewMode === "grid"
                    ? "bg-gray-900 text-white"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                aria-label="Grid view"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition-colors ${
                  viewMode === "list"
                    ? "bg-gray-900 text-white"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                aria-label="List view"
              >
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredAndSortedProducts.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                : "space-y-6"
            }
          >
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full 
              bg-gray-50 mb-6">
              <SlidersHorizontal className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-2xl font-light text-gray-900 mb-3">
              No products found
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSortBy("featured");
              }}
              className="px-8 py-3 bg-gray-900 text-white text-sm font-medium
                hover:bg-gray-800 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}