"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { useAuthStore, useStore } from "@/lib/store";
import AuthModal from "./AuthModal";

export default function Navigation() {
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const user = useAuthStore((state) => state.user);
  const cart = useStore((state) => state.cart);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-b border-gray-200 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Toggle menu"
              >
                {showMenu ? <X size={20} /> : <Menu size={20} />}
              </button>
              <Link href="/" className="flex items-center">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  FurniHub
                </h1>
              </Link>
            </div>

            <div className="hidden lg:flex items-center gap-6">
              <Link
                href="/"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className={`text-sm font-medium transition-colors ${
                  pathname === "/shop"
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                Shop
              </Link>
              {user?.role === "vendor" && (
                <Link
                  href="/vendor"
                  className={`text-sm font-medium transition-colors ${
                    pathname === "/vendor"
                      ? "text-blue-600"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  My Store
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/cart"
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart size={20} className="text-gray-700" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                    {cart.length}
                  </span>
                )}
              </Link>

              {user ? (
                <Link
                  href="/profile"
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  aria-label="User profile"
                >
                  <User size={20} className="text-gray-700" />
                </Link>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              <Link
                href="/"
                onClick={() => setShowMenu(false)}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={() => setShowMenu(false)}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
              >
                Shop
              </Link>
              {user?.role === "vendor" && (
                <Link
                  href="/vendor"
                  onClick={() => setShowMenu(false)}
                  className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
                >
                  My Store
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
