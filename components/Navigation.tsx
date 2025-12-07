'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Search, User, ShoppingCart, ChevronDown, LogOut } from 'lucide-react';
import { useStore, useAuthStore } from '@/lib/store';
import AuthModal from './AuthModal';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Sofas', href: '/shop?category=Sofas' },
  { name: 'Tables', href: '/shop?category=Tables' },
  { name: 'Chairs', href: '/shop?category=Chairs' },
  { name: 'Storage', href: '/shop?category=Storage' },
  { name: 'Beds', href: '/shop?category=Beds' },
  {
    name: 'More',
    href: '#',
    dropdown: [
      { name: 'New Arrivals', href: '/new' },
      { name: 'Sale', href: '/sale' },
      { name: 'Vendors', href: '/vendors' },
      { name: 'About', href: '/about' },
    ],
  },
];

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cart = useStore((state) => state.cart);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const products = useStore((state) => state.products);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Determine active nav item
  const getActiveNav = () => {
    if (pathname === '/') return 'Home';
    if (pathname === '/shop') {
      const category = searchParams.get('category');
      return category || 'Shop';
    }
    return null;
  };

  const activeNav = getActiveNav();

  // Filter products for search
  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 6)
    : [];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchResults(false);
      setSearchFocused(false);
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.trim().length > 0);
  };

  const handleProductClick = (productId: number) => {
    router.push(`/product/${productId}`);
    setShowSearchResults(false);
    setSearchQuery('');
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        {/* Top Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-8">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-2xl font-light tracking-tight text-gray-900">
                Ka<span className="font-semibold">Mara</span>
              </h1>
            </Link>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl relative z-50" ref={searchRef}>
              <form onSubmit={handleSearch}>
                <div
                  className={`relative transition-all duration-300 ${
                    searchFocused ? 'scale-[1.02]' : ''
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Search furniture..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={() => {
                      setSearchFocused(true);
                      if (searchQuery.trim()) setShowSearchResults(true);
                    }}
                    onBlur={() => setSearchFocused(false)}
                    className={`w-full pl-4 pr-12 py-2.5 bg-gray-50 border rounded-full text-sm
                      transition-all duration-300 outline-none
                      ${
                        searchFocused
                          ? 'bg-white border-gray-900 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full
                      hover:bg-gray-100 transition-colors"
                  >
                    <Search className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl 
                  shadow-xl border border-gray-100 overflow-hidden z-50">
                  <div className="p-2">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 
                          rounded-xl transition-colors text-left"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.category} • {product.vendor}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          ${product.price}
                        </p>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                    <button
                      onClick={handleSearch}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Icons */}
            <div className="flex items-center gap-2">
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <>
                    <button
                      onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                      className="p-2.5 rounded-full hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-5 h-5 text-gray-700" />
                    </button>

                    {userDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl 
                        border border-gray-100 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-sm text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                          {user.role === 'vendor' && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-orange-100 text-orange-700 
                              rounded text-xs font-medium">
                              Vendor
                            </span>
                          )}
                        </div>
                        <Link
                          href="/profile"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 
                            hover:text-gray-900 transition-colors"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          My Profile
                        </Link>
                        {user.role === 'vendor' && (
                          <Link
                            href="/vendor/dashboard"
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 
                              hover:text-gray-900 transition-colors"
                            onClick={() => setUserDropdownOpen(false)}
                          >
                            Vendor Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 
                            hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="p-2.5 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-700" />
                  </button>
                )}
              </div>

              <Link
                href="/cart"
                className="relative p-2.5 rounded-full hover:bg-gray-50 transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs
                    w-5 h-5 flex items-center justify-center rounded-full font-medium">
                    {cartItemsCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Navigation Menu */}
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-1">
            {navItems.map((item, index) => {
              const isActive = activeNav === item.name;
              const isHovered = hoveredNav === item.name;

              return (
                <div key={item.name} className="flex items-center">
                  {index > 0 && <div className="h-4 w-px bg-gray-200 mx-1" />}

                  {item.dropdown ? (
                    <div
                      className="relative"
                      onMouseEnter={() => {
                        setHoveredNav(item.name);
                        setMoreDropdownOpen(true);
                      }}
                      onMouseLeave={() => {
                        setHoveredNav(null);
                        setMoreDropdownOpen(false);
                      }}
                    >
                      <button
                        className="relative px-4 py-3 text-sm font-medium text-gray-700
                          hover:text-gray-900 transition-colors flex items-center gap-1 group"
                      >
                        {item.name}
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            moreDropdownOpen ? 'rotate-180' : ''
                          }`}
                        />
                        <span
                          className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900
                            transition-all duration-300 ease-in-out origin-center ${
                              isHovered || moreDropdownOpen
                                ? 'opacity-100 scale-x-100'
                                : 'opacity-0 scale-x-0'
                            }`}
                        />
                      </button>

                      {moreDropdownOpen && (
                        <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg
                          shadow-lg border border-gray-100 py-2 z-50">
                          {item.dropdown.map((dropItem) => (
                            <Link
                              key={dropItem.name}
                              href={dropItem.href}
                              className="block px-4 py-2.5 text-sm text-gray-700
                                hover:bg-gray-50 hover:text-gray-900 transition-colors"
                            >
                              {dropItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onMouseEnter={() => setHoveredNav(item.name)}
                      onMouseLeave={() => setHoveredNav(null)}
                      className="relative px-4 py-3 text-sm font-medium text-gray-700
                        hover:text-gray-900 transition-colors group"
                    >
                      {item.name}
                      <span
                        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900
                          transition-all duration-300 ease-in-out origin-center ${
                            isActive || isHovered
                              ? 'opacity-100 scale-x-100'
                              : 'opacity-0 scale-x-0'
                          }`}
                      />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}