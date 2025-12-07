'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useStore, useAuthStore } from '@/lib/store';
import { 
  ShoppingCart, 
  Heart, 
  Star, 
  Check, 
  Truck, 
  Shield, 
  RotateCcw,
  ChevronLeft,
  Store,
  Package,
  Ruler,
  ChevronRight
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const products = useStore((state) => state.products);
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const user = useAuthStore((state) => state.user);
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showAddedToCart, setShowAddedToCart] = useState(false);

  const productId = parseInt(params.id as string);
  const product = products.find(p => p.id === productId);

  // Get related products from same category
  const relatedProducts = product 
    ? products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  useEffect(() => {
    if (!product) {
      router.push('/shop');
    }
  }, [product, router]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">Product not found</p>
          <Link
            href="/shop"
            className="inline-block px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Generate multiple images for gallery (using same image with different crops)
  const productImages = [
    product.image,
    product.image + '&crop=top',
    product.image + '&crop=bottom',
    product.image + '&crop=left'
  ];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setShowAddedToCart(true);
    setTimeout(() => setShowAddedToCart(false), 3000);
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product);
  };

  const inWishlist = isInWishlist(product.id);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link href="/shop" className="text-gray-500 hover:text-gray-900 transition-colors">
              Shop
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <Link 
              href={`/shop?category=${product.category}`}
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              {product.category}
            </Link>
            <ChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-8 group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Image Gallery */}
          <div>
            <div className="sticky top-24">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-50 mb-4 overflow-hidden group">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="px-6 py-3 bg-white text-gray-900 font-semibold text-lg">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-4">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square bg-gray-50 overflow-hidden border-2 transition-all ${
                      selectedImage === idx 
                        ? 'border-gray-900' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Category & Vendor */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-gray-500 font-medium">
                {product.category}
              </span>
              <Link
                href={`/shop?vendor=${encodeURIComponent(product.vendor)}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Store className="w-4 h-4" />
                {product.vendor}
              </Link>
            </div>

            {/* Product Name */}
            <h1 className="text-4xl font-light text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="mb-8">
              <p className="text-4xl font-light text-gray-900">
                ${product.price.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500 mt-1">Tax included. Shipping calculated at checkout.</p>
            </div>

            {/* Stock Status */}
            <div className="mb-8">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-5 h-5" />
                  <span className="font-medium">In Stock - Ready to Ship</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600">
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8 pb-8 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors"
                    disabled={!product.inStock}
                  >
                    -
                  </button>
                  <span className="px-6 py-3 border-x border-gray-300 font-medium min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 hover:bg-gray-50 transition-colors"
                    disabled={!product.inStock}
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-600">
                  Total: ${(product.price * quantity).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 text-white hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`px-4 py-4 border-2 transition-colors ${
                  inWishlist
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-900'
                }`}
              >
                <Heart
                  className={`w-6 h-6 ${
                    inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
                  }`}
                />
              </button>
            </div>

            {/* Success Message */}
            {showAddedToCart && (
              <div className="mb-8 p-4 bg-green-50 border border-green-200 text-green-800 flex items-center gap-3 animate-fadeIn">
                <Check className="w-5 h-5" />
                <span className="font-medium">Added to cart successfully!</span>
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-1 gap-4 mb-8 pb-8 border-b border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Truck className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Free Shipping</h4>
                  <p className="text-sm text-gray-600">On orders over $500</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">2 Year Warranty</h4>
                  <p className="text-sm text-gray-600">Full manufacturer warranty</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">30-Day Returns</h4>
                  <p className="text-sm text-gray-600">Easy return policy</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Product Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium text-gray-900">{product.category}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Vendor</span>
                  <span className="font-medium text-gray-900">{product.vendor}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">SKU</span>
                  <span className="font-medium text-gray-900">FH-{product.id}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Availability</span>
                  <span className={`font-medium ${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-light text-gray-900">
                You May Also <span className="font-semibold">Like</span>
              </h2>
              <Link
                href={`/shop?category=${product.category}`}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 group"
              >
                View All {product.category}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/product/${relatedProduct.id}`}
                  className="group"
                >
                  <div className="relative aspect-square bg-gray-50 mb-4 overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                      {relatedProduct.category}
                    </p>
                    <h3 className="font-light text-gray-900 mb-2 group-hover:text-gray-600 transition-colors line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-medium text-gray-900">
                        ${relatedProduct.price}
                      </p>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs text-gray-500">{relatedProduct.rating}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}