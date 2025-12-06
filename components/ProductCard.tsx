"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  viewMode?: "grid" | "list";
}

export default function ProductCard({ product, viewMode = "grid" }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const addToCart = useStore((state) => state.addToCart);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const isInWishlist = useStore((state) => state.isInWishlist);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  if (viewMode === "list") {
    return (
      <Link href={`/product/${product.id}`} className="block group">
        <div className="bg-white border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex gap-8 p-6">
            {/* Image */}
            <div className="relative w-64 h-64 flex-shrink-0 bg-gray-50 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-full object-cover transition-all duration-700 
                  ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"} 
                  group-hover:scale-105`}
              />
              {!product.inStock && (
                <div className="absolute inset-0 bg-white/95 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Out of Stock
                  </span>
                </div>
              )}
              {product.inStock && (
                <div className="absolute bottom-4 left-4 px-3 py-1 bg-gray-900/90 text-white 
                  text-xs font-medium uppercase tracking-wide">
                  In Stock
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between py-2">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
                  {product.category}
                </p>
                <h3 className="text-2xl font-light text-gray-900 mb-2 group-hover:text-gray-600 
                  transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{product.vendor}</p>

                {product.description && (
                  <p className="text-gray-600 line-clamp-2 mb-6 leading-relaxed">
                    {product.description}
                  </p>
                )}

                {product.rating && (
                  <div className="flex items-center gap-2 mb-6">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(product.rating!)
                              ? "fill-amber-400 text-amber-400"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {product.rating} ({product.reviews} reviews)
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <p className="text-3xl font-light text-gray-900">
                  ${product.price.toLocaleString()}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleWishlist}
                    className="p-3 border border-gray-200 hover:border-gray-900 
                      transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors ${
                        inWishlist
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400 hover:text-red-500"
                      }`}
                    />
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="px-8 py-3 bg-gray-900 text-white text-sm font-medium
                      hover:bg-gray-800 transition-colors disabled:bg-gray-300 
                      disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view (default) - Kamara-inspired design
  return (
    <Link 
      href={`/product/${product.id}`} 
      className="block group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-white border border-gray-100 hover:shadow-xl transition-all duration-300">
        {/* Image */}
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 
              ${imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-110"} 
              ${isHovered ? "scale-105" : "scale-100"}`}
          />
          
          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm
              hover:bg-white transition-all duration-300 
              ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}
            aria-label="Add to wishlist"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                inWishlist
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600 hover:text-red-500"
              }`}
            />
          </button>

          {/* Stock Badge */}
          {product.inStock ? (
            <div className="absolute bottom-4 left-4 px-3 py-1 bg-gray-900/90 backdrop-blur-sm
              text-white text-xs font-medium uppercase tracking-wide">
              In Stock
            </div>
          ) : (
            <div className="absolute inset-0 bg-white/95 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Out of Stock
              </span>
            </div>
          )}

          {/* Add to Cart Overlay (appears on hover) */}
          <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent 
            transition-all duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
            <div className="p-4">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="w-full py-2.5 bg-white text-gray-900 text-sm font-medium
                  hover:bg-gray-100 transition-colors disabled:bg-gray-300 
                  disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
            {product.category}
          </p>
          <h3 className="text-base font-light text-gray-900 mb-1 line-clamp-1 
            group-hover:text-gray-600 transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mb-3">{product.vendor}</p>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-50">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.floor(product.rating!)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-400">
                ({product.reviews})
              </span>
            </div>
          )}

          {/* Price */}
          <p className="text-xl font-light text-gray-900">
            ${product.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Link>
  );
}