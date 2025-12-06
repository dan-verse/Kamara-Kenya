'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Phone, Mail, Clock } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating: number;
}

export default function VendorPage() {
  const [activeTab, setActiveTab] = useState('products');

  const vendor = {
    id: 1,
    name: 'Elegance Furniture',
    rating: 4.8,
    reviews: 247,
    location: 'Nairobi, Kenya',
    phone: '+254 700 000 000',
    email: 'info@elegancefurniture.co.ke',
    description: 'Premium furniture manufacturer specializing in modern and contemporary designs. We pride ourselves on quality craftsmanship and customer satisfaction.',
    hours: 'Mon-Sat: 8:00 AM - 6:00 PM',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'
  };

  const products: Product[] = [
    {
      id: 1,
      name: 'Modern Velvet Sofa',
      price: 45000,
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400',
      rating: 4.9
    },
    {
      id: 2,
      name: 'Leather Accent Chair',
      price: 28000,
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
      rating: 4.7
    },
    {
      id: 3,
      name: 'Coffee Table Set',
      price: 22000,
      image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=400',
      rating: 4.8
    },
    {
      id: 4,
      name: 'Bookshelf Unit',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400',
      rating: 4.6
    },
    {
      id: 5,
      name: 'TV Console Stand',
      price: 32000,
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
      rating: 4.8
    },
    {
      id: 6,
      name: 'Dining Chair Set',
      price: 42000,
      image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400',
      rating: 4.9
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="relative w-full md:w-48 h-48 flex-shrink-0">
              <Image
                src={vendor.image}
                alt={vendor.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{vendor.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star fill="#f59e0b" className="text-yellow-500" size={20} />
                  <span className="font-semibold">{vendor.rating}</span>
                  <span className="text-gray-600">({vendor.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin size={18} />
                  <span>{vendor.location}</span>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{vendor.description}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone size={18} />
                  <span>{vendor.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail size={18} />
                  <span>{vendor.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock size={18} />
                  <span>{vendor.hours}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-b">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`pb-4 font-semibold border-b-2 transition-colors ${
                  activeTab === 'products'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab('about')}
                className={`pb-4 font-semibold border-b-2 transition-colors ${
                  activeTab === 'about'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 font-semibold border-b-2 transition-colors ${
                  activeTab === 'reviews'
                    ? 'border-orange-600 text-orange-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Reviews
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-64">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-600 font-bold text-lg">
                      KES {product.price.toLocaleString()}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star fill="#f59e0b" className="text-yellow-500" size={16} />
                      <span className="text-sm font-semibold">{product.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {activeTab === 'about' && (
          <div className="bg-white rounded-lg p-6 max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">About {vendor.name}</h2>
            <p className="text-gray-700 mb-4">{vendor.description}</p>
            <p className="text-gray-700 mb-4">
              With over 10 years of experience in the furniture industry, we have established ourselves as a trusted name in quality furniture manufacturing and retail.
            </p>
            <p className="text-gray-700">
              Our team of skilled craftsmen and designers work together to create pieces that blend functionality with aesthetic appeal, ensuring every product meets our high standards of excellence.
            </p>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-4 max-w-3xl">
            {[1, 2, 3, 4, 5].map((review) => (
              <div key={review} className="bg-white rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="font-semibold text-orange-600">JD</span>
                  </div>
                  <div>
                    <p className="font-semibold">John Doe</p>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          fill="#f59e0b"
                          className="text-yellow-500"
                          size={14}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-700">
                  Excellent quality furniture and great customer service. The delivery was prompt and the team was very professional. Highly recommended!
                </p>
                <p className="text-sm text-gray-500 mt-2">2 weeks ago</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}