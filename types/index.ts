export interface User {
  id: number;
  email: string;
  name: string;
  role: 'customer' | 'vendor';
}

export interface Product {
  id: number;
  name: string;
  price: number;
  vendor: string;
  vendorId: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  description?: string;
  removeProduct: (id: number) => void;
  updateProduct: (id: number, updates: Partial<Product>) => void;

}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: number;
  userId: string; // Added to track which user made the order
  items: CartItem[];
  total: number;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
}