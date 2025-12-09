'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingCart, X, Plus, Minus, ArrowRight } from 'lucide-react';
import { useStore, useAuthStore } from '@/lib/store';

export default function CartPage() {
  const router = useRouter();
  const cart = useStore((state) => state.cart);
  const { removeFromCart, updateQuantity, placeOrder } = useStore();
  const user = useAuthStore((state) => state.user);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const handleCheckout = () => {
    if (user) {
      placeOrder([...cart], cartTotal, String(user.id));
      alert('Order placed successfully!');
      router.push('/profile');
    } else {
      router.push('/');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center py-24">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full 
              bg-gray-50 mb-6">
              <ShoppingCart className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-3xl font-light text-gray-900 mb-3">
              Your cart is <span className="font-semibold">empty</span>
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start shopping to add items to your cart and bring your space to life
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white 
                font-medium hover:bg-gray-800 transition-colors group"
            >
              Browse Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 border-b border-gray-100 pb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-3">
            Shopping <span className="font-semibold">Cart</span>
          </h1>
          <p className="text-gray-600">
            {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-100 hover:shadow-lg transition-shadow 
                  duration-300"
              >
                <div className="flex gap-6 p-6">
                  {/* Image */}
                  <div className="relative w-32 h-32 flex-shrink-0 bg-gray-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                            {item.category}
                          </p>
                          <h3 className="text-lg font-light text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">{item.vendor}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-200 
                            hover:border-gray-900 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center border border-gray-200 
                            hover:border-gray-900 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-xl font-light text-gray-900">
                        ${(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-100 p-8 sticky top-24">
              <h2 className="text-2xl font-light text-gray-900 mb-6">
                Order <span className="font-semibold">Summary</span>
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900">
                    ${cartTotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span className="font-medium text-gray-900">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-light text-gray-900 mb-8">
                <span>Total</span>
                <span className="font-semibold">${cartTotal.toLocaleString()}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-gray-900 text-white font-medium 
                  hover:bg-gray-800 transition-colors mb-4"
              >
                {user ? 'Proceed to Checkout' : 'Sign In to Checkout'}
              </button>

              <Link
                href="/shop"
                className="block text-center text-sm text-gray-600 hover:text-gray-900 
                  transition-colors"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-8 pt-8 border-t border-gray-200 space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-10 h-10 bg-white border border-gray-200 flex items-center 
                    justify-center">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-10 h-10 bg-white border border-gray-200 flex items-center 
                    justify-center">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <span>Free shipping over $500</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-10 h-10 bg-white border border-gray-200 flex items-center 
                    justify-center">
                    <span className="text-xs font-bold">✓</span>
                  </div>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}