'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore, useStore } from '@/lib/store';
import { Package, User, Mail, Calendar, Store, Edit2, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const orders = useStore((state) => state.orders);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');

  const userOrders = user ? orders.filter(order => order.userId === user.email) : [];

  useEffect(() => {
    if (!user) {
      router.push('/');
    } else {
      setEditedName(user.name);
    }
  }, [user, router]);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please log in to view your profile</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveName = () => {
    // Update user name in store
    const updatedUser = { ...user, name: editedName };
    useAuthStore.setState({ user: updatedUser });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(user.name);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-900 mb-2">
            My <span className="font-semibold">Profile</span>
          </h1>
          <p className="text-gray-600">Manage your account and view your orders</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 p-8">
              <div className="flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-600 rounded-full mx-auto mb-6 text-white text-3xl font-light">
                {user.name.charAt(0).toUpperCase()}
              </div>
              
              {/* Editable Name */}
              <div className="text-center mb-2">
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 focus:border-gray-900 focus:outline-none text-center text-xl"
                      placeholder="Your name"
                    />
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={handleSaveName}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors text-sm"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors text-sm"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-2xl font-light text-gray-900 mb-1">
                      {user.name}
                    </h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                      Edit Name
                    </button>
                  </div>
                )}
              </div>
              
              {user.role === 'vendor' && (
                <div className="flex justify-center mb-6">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    <Store className="w-4 h-4" />
                    Vendor Account
                  </span>
                </div>
              )}

              <div className="space-y-4 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm break-all">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">Member since {new Date().getFullYear()}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Package className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{userOrders.length} order{userOrders.length !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {user.role === 'vendor' && (
                <Link
                  href="/vendor/dashboard"
                  className="mt-6 w-full flex items-center justify-center gap-2 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  <Store className="w-4 h-4" />
                  Go to Vendor Dashboard
                </Link>
              )}

              {/* Account Type Info */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Account Type</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    You are signed in as a <span className="font-semibold text-gray-900">{user.role}</span>
                  </p>
                  {user.role === 'customer' ? (
                    <p className="text-xs text-gray-500">
                      Want to sell products? Contact support to upgrade to a vendor account.
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      You can list and manage products in your vendor dashboard.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-light text-gray-900">
                  Order <span className="font-semibold">History</span>
                </h2>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  {userOrders.length} Total
                </span>
              </div>

              {userOrders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                    <Package className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-gray-600 mb-2">No orders yet</p>
                  <p className="text-sm text-gray-500 mb-6">
                    Start shopping to see your orders here
                  </p>
                  <Link
                    href="/shop"
                    className="inline-block px-6 py-3 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {userOrders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              Order #{order.id}
                            </p>
                            <p className="text-xs text-gray-400">
                              {new Date(order.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            {order.status}
                          </span>
                        </div>

                        <div className="space-y-3 mb-4">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex gap-4 items-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover bg-gray-50"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Qty: {item.quantity} • ${item.price} each
                                </p>
                              </div>
                              <p className="text-sm font-semibold text-gray-900">
                                ${(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                          <p className="text-sm text-gray-600">Total Amount</p>
                          <p className="text-lg font-semibold text-gray-900">
                            ${order.total.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}