"use client";

import { Heart, Star, Plus } from "lucide-react";
import { useStore } from "@/lib/store";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
        <button
          onClick={() => toggleWishlist(product)}
          className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition"
        >
          <Heart
            size={20}
            className={
              inWishlist ? "fill-red-500 text-red-500" : "text-gray-600"
            }
          />
        </button>
        {product.inStock && (
          <div className="absolute bottom-4 left-4 px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
            In Stock
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-600 mb-1">{product.vendor}</p>
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{product.rating}</span>
          </div>
          <span className="text-sm text-gray-500">({product.reviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold">${product.price}</p>
          <button
            onClick={() => addToCart(product)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition inline-flex items-center gap-2"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
