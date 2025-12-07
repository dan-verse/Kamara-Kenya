"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, Product, CartItem, Order } from "@/types";

interface AuthState {
  user: User | null;
  login: (
    email: string,
    password: string,
    role?: "customer" | "vendor"
  ) => Promise<User>;
  register: (
    email: string,
    password: string,
    role: "customer" | "vendor"
  ) => Promise<User>;
  logout: () => void;
}

interface StoreState {
  updateProduct: any;
  removeProduct: any;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  wishlist: Product[];
  addProduct: (product: Product) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  placeOrder: (items: CartItem[], total: number, userId: string) => Order;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
}

// Initial products data
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Modern Leather Sofa",
    price: 1299,
    vendor: "Urban Furnish Co.",
    vendorId: 101,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400",
    category: "Sofas",
    rating: 4.8,
    reviews: 124,
    inStock: true,
    description: "Premium Italian leather with solid oak frame",
    removeProduct: function (id: number): void {
      throw new Error("Function not implemented.");
    },
    updateProduct: function (id: number, updates: Partial<Product>): void {
      throw new Error("Function not implemented.");
    }
  },
  {
    id: 2,
    name: "Scandinavian Dining Table",
    price: 899,
    vendor: "Nordic Home",
    vendorId: 102,
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400",
    category: "Tables",
    rating: 4.9,
    reviews: 89,
    inStock: true,
    description: "Solid oak with minimalist design",
    removeProduct: function (id: number): void {
      throw new Error("Function not implemented.");
    },
    updateProduct: function (id: number, updates: Partial<Product>): void {
      throw new Error("Function not implemented.");
    }
  },
  {
    id: 3,
    name: "Ergonomic Office Chair",
    price: 449,
    vendor: "Workspace Pro",
    vendorId: 103,
    image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400",
    category: "Chairs",
    rating: 4.7,
    reviews: 203,
    inStock: true,
    description: "Mesh back with lumbar support",
    removeProduct: function (id: number): void {
      throw new Error("Function not implemented.");
    },
    updateProduct: function (id: number, updates: Partial<Product>): void {
      throw new Error("Function not implemented.");
    }
  },
  {
    id: 4,
    name: "Mid-Century Bookshelf",
    price: 599,
    vendor: "Retro Living",
    vendorId: 104,
    image: "https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400",
    category: "Storage",
    rating: 4.6,
    reviews: 67,
    inStock: true,
    description: "Walnut finish with adjustable shelves",
    removeProduct: function (id: number): void {
      throw new Error("Function not implemented.");
    },
    updateProduct: function (id: number, updates: Partial<Product>): void {
      throw new Error("Function not implemented.");
    }
  },
  {
    id: 5,
    name: "Velvet Accent Chair",
    price: 379,
    vendor: "Urban Furnish Co.",
    vendorId: 101,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    category: "Chairs",
    rating: 4.5,
    reviews: 92,
    inStock: true,
    description: "Plush velvet with gold metal legs",
    removeProduct: function (id: number): void {
      throw new Error("Function not implemented.");
    },
    updateProduct: function (id: number, updates: Partial<Product>): void {
      throw new Error("Function not implemented.");
    }
  },
  {
    id: 6,
    name: "Industrial Coffee Table",
    price: 329,
    vendor: "Loft Living",
    vendorId: 105,
    image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400",
    category: "Tables",
    rating: 4.8,
    reviews: 156,
    inStock: true,
    description: "Reclaimed wood with steel frame",
    removeProduct: function (id: number): void {
      throw new Error("Function not implemented.");
    },
    updateProduct: function (id: number, updates: Partial<Product>): void {
      throw new Error("Function not implemented.");
    }
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: async (email, password, role = "customer") => {
        const user: User = {
          id: Date.now(),
          email,
          name: email.split("@")[0],
          role,
        };
        set({ user });
        return user;
      },
      register: async (email, password, role) => {
        const user: User = {
          id: Date.now(),
          email,
          name: email.split("@")[0],
          role,
        };
        set({ user });
        return user;
      },
      logout: () => set({ user: null }),
    }),
    {
      name: "furnihub-auth",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      products: initialProducts,
      cart: [],
      orders: [],
      wishlist: [],
      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            {
              ...product,
              id: Date.now(),
              rating: 0,
              reviews: 0,
              inStock: true,
            },
          ],
        })),
      addToCart: (product) =>
        set((state) => {
          const exists = state.cart.find((item) => item.id === product.id);
          if (exists) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),
      updateQuantity: (productId, quantity) =>
        set((state) => {
          if (quantity <= 0) {
            return { cart: state.cart.filter((item) => item.id !== productId) };
          }
          return {
            cart: state.cart.map((item) =>
              item.id === productId ? { ...item, quantity } : item
            ),
          };
        }),
      removeProduct: (id: number) =>
  set((state) => ({
    products: state.products.filter((p) => p.id !== id),
  })),

updateProduct: (id: number, updates: Partial<Product>) =>
  set((state) => ({
    products: state.products.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    ),
  })),
      placeOrder: (items, total, userId) => {
        const order: Order = {
          id: Date.now(),
          userId, // Added userId to track which user made the order
          items,
          total,
          date: new Date().toISOString(),
          status: "Processing",
        };
        set((state) => ({
          orders: [...state.orders, order],
          cart: [],
        }));
        return order;
      },
      toggleWishlist: (product) =>
        set((state) => {
          const exists = state.wishlist.find((item) => item.id === product.id);
          if (exists) {
            return {
              wishlist: state.wishlist.filter((item) => item.id !== product.id),
            };
          }
          return { wishlist: [...state.wishlist, product] };
        }),
      isInWishlist: (productId) => {
        return get().wishlist.some((item) => item.id === productId);
      },
    }),
    {
      name: "furnihub-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);