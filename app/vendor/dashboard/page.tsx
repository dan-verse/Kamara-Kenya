"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Percent,
  BarChart2,
  MessageSquare,
  Wallet,
  Heart,
  CreditCard,
  Bell,
  Settings,
  LogOut,
  User2,
  PlusCircle,
  LucideIcon,
} from "lucide-react";

import { useAuthStore, useStore } from "@/lib/store";
import AnalyticsCharts from "./components/Charts";

/* ------------------------------------------------ */
/* MAIN COMPONENT                                   */
/* ------------------------------------------------ */

export default function VendorDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const products = useStore((state) => state.products);
  const orders = useStore((state) => state.orders);

  const [activePanel, setActivePanel] = useState("dashboard");

  useEffect(() => {
    if (!user || user.role !== "vendor") {
      router.push("/");
    }
  }, [user, router]);

  if (!user || user.role !== "vendor") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Access denied. Vendor account required.</p>
      </div>
    );
  }

  // Vendor-specific data
  const vendorProducts = products.filter((p) => p.vendor === user.name);

  const vendorOrders = orders.filter((o) =>
    o.items.some((i) => vendorProducts.some((p) => p.id === i.id))
  );

  const totalRevenue = vendorOrders.reduce((sum, order) => {
    const vendorItems = order.items.filter((item) =>
      vendorProducts.some((p) => p.id === item.id)
    );
    return sum + vendorItems.reduce((a, c) => a + c.price * c.quantity, 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#2C1A5A] text-white min-h-screen py-8 shadow-lg">
        <div className="px-6 mb-8">
          <h2 className="text-xl font-semibold tracking-wide">Vendor Panel</h2>
        </div>

        <nav className="flex flex-col gap-1 px-4">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activePanel === "dashboard"}
            onClick={() => setActivePanel("dashboard")}
          />

          <SidebarItem
            icon={ShoppingCart}
            label="Orders"
            active={activePanel === "orders"}
            onClick={() => setActivePanel("orders")}
          />

          <SidebarItem
            icon={PlusCircle}
            label="Add Product"
            active={activePanel === "add-product"}
            onClick={() => setActivePanel("add-product")}
          />

          <SidebarItem
          icon={ShoppingCart}
          label="Products"
          active={activePanel === "products"}
          onClick={() => setActivePanel("products")}
          />


          <SidebarItem
            icon={Percent}
            label="Coupons"
            active={activePanel === "coupons"}
            onClick={() => setActivePanel("coupons")}
          />

          <SidebarItem
            icon={BarChart2}
            label="Reports"
            active={activePanel === "reports"}
            onClick={() => setActivePanel("reports")}
          />

          <SidebarItem
            icon={MessageSquare}
            label="Reviews"
            active={activePanel === "reviews"}
            onClick={() => setActivePanel("reviews")}
          />

          <SidebarItem
            icon={Wallet}
            label="Withdraw"
            active={activePanel === "withdraw"}
            onClick={() => setActivePanel("withdraw")}
          />

          <SidebarItem
            icon={Heart}
            label="Followers"
            active={activePanel === "followers"}
            onClick={() => setActivePanel("followers")}
          />

          <SidebarItem
            icon={CreditCard}
            label="Subscription"
            active={activePanel === "subscription"}
            onClick={() => setActivePanel("subscription")}
          />

          <SidebarItem
            icon={Bell}
            label="Announcements"
            active={activePanel === "announcements"}
            onClick={() => setActivePanel("announcements")}
          />

          <SidebarItem
            icon={Settings}
            label="Settings"
            active={activePanel === "settings"}
            onClick={() => setActivePanel("settings")}
          />
        </nav>

        <div className="mt-12 px-4 border-t border-white/20 pt-6 flex flex-col gap-2">
          <SidebarItem
            icon={User2}
            label="Profile"
            active={activePanel === "profile"}
            onClick={() => setActivePanel("profile")}
          />

          <SidebarItem icon={LogOut} label="Logout" />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-10">
        {renderPanel(activePanel, {
          totalRevenue,
          vendorOrders,
          vendorProducts,
        })}
      </main>
    </div>
  );
}

/* ------------------------------------------------ */
/* SIDEBAR COMPONENT                                 */
/* ------------------------------------------------ */

function SidebarItem({
  icon: Icon,
  label,
  active = false,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg cursor-pointer transition-all
        ${
          active
            ? "bg-white text-[#2C1A5A] shadow-sm"
            : "text-white/80 hover:bg-white/10 hover:text-white"
        }`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </div>
  );
}

/* ------------------------------------------------ */
/* EDIT PRODUCT MODAL                                */
/* ------------------------------------------------ */

function EditProductModal({
  productId,
  onClose,
}: {
  productId: number;
  onClose: () => void;
}) {
  const product = useStore((state) =>
    state.products.find((p) => p.id === productId)
  );

  const updateProduct = useStore((state) => state.updateProduct);

  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [image, setImage] = useState(product?.image || "");
  const [category, setCategory] = useState(product?.category || "");
  const [description, setDescription] = useState(product?.description || "");

  const save = () => {
    updateProduct(productId, {
      name,
      price,
      image,
      category,
      description,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl p-8 rounded-xl shadow-lg">
        <h3 className="text-2xl font-semibold mb-6">Edit Product</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Form */}
          <div className="flex flex-col gap-4">
            <InputField label="Name" value={name} onChange={setName} />
            <InputField
              label="Price"
              type="number"
              value={price}
              onChange={(v) => setPrice(Number(v))}
            />
            <InputField label="Image URL" value={image} onChange={setImage} />

            <InputField
              label="Category"
              value={category}
              onChange={setCategory}
            />

            <TextAreaField
              label="Description"
              value={description}
              onChange={setDescription}
            />
          </div>

          {/* Live Preview */}
          <div className="bg-gray-50 border rounded-xl p-4">
            <img
              src={image}
              className="w-full h-48 object-cover rounded-md"
            />
            <h4 className="text-xl font-semibold mt-4">{name}</h4>
            <p className="text-gray-600">KSh {price}</p>
            <p className="text-sm text-gray-500 mt-2">{description}</p>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}


/* ------------------------------------------------ */
/* PANEL SWITCHER                                    */
/* ------------------------------------------------ */

interface PanelData {
  totalRevenue: number;
  vendorOrders: any[];
  vendorProducts: any[];
}

function renderPanel(panel: string, data: PanelData) {
  switch (panel) {
    case "dashboard":
      return <DashboardPanel {...data} />;

    case "orders":
      return <OrdersPanel />;

    case "add-product":
      return <AddProductPanel />;

    case "products":
        return <ProductsPanel />;


    case "coupons":
      return <CouponsPanel />;

    case "reports":
      return <ReportsPanel />;

    case "reviews":
      return <ReviewsPanel />;

    case "withdraw":
      return <WithdrawPanel />;

    case "followers":
      return <FollowersPanel />;

    case "subscription":
      return <SubscriptionPanel />;

    case "announcements":
      return <AnnouncementsPanel />;

    case "settings":
      return <SettingsPanel />;

    case "profile":
      return <ProfilePanel />;

    default:
      return <div />;
  }
}

/* ------------------------------------------------ */
/* DASHBOARD PANEL                                   */
/* ------------------------------------------------ */

interface DashboardPanelProps {
  totalRevenue: number;
  vendorOrders: any[];
  vendorProducts: any[];
}

function DashboardPanel({
  totalRevenue,
  vendorOrders,
  vendorProducts,
}: DashboardPanelProps) {
  return (
    <>
      <h1 className="text-4xl font-bold mb-10">Dashboard</h1>

      {/* Profile Completion */}
      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <p className="text-sm font-medium text-gray-600 mb-3">
          Profile Completion
        </p>
        <div className="h-2 bg-gray-200 rounded-full mb-4">
          <div className="h-full w-[20%] bg-indigo-500 rounded-full"></div>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-700 p-3 rounded-lg">
          Add Banner to gain 15% progress
        </div>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Total Revenue"
          value={`KSh ${totalRevenue.toFixed(2)}`}
        />
        <StatCard title="Total Orders" value={vendorOrders.length} />
        <StatCard title="Products" value={vendorProducts.length} />
      </div>

      {/* Real-time charts */}
      <AnalyticsCharts orders={vendorOrders} revenue={totalRevenue} />
    </>
  );
}

/* ------------------------------------------------ */
/* ADD PRODUCT PANEL                                 */
/* ------------------------------------------------ */

function AddProductPanel() {
  const user = useAuthStore((state) => state.user);
  const addProduct = useStore((state) => state.addProduct);

  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("Chairs");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    addProduct({
        id: Date.now(),
        name,
        price: Number(price),
        vendor: user.name,
        vendorId: user.id,
        image,
        category,
        rating: 0,
        reviews: 0,
        inStock: true,
        description,
        removeProduct: function (id: number): void {
            throw new Error("Function not implemented.");
        },
        updateProduct: function (id: number, updates: Partial<Product>): void {
            throw new Error("Function not implemented.");
        }
    });

    setLoading(false);
    setSuccess(true);

    setName("");
    setPrice("");
    setImage("");
    setDescription("");

    setTimeout(() => setSuccess(false), 1500);
  };

  return (
    <Panel title="Add New Product">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <InputField
          label="Product Name"
          value={name}
          onChange={setName}
          required
        />

        <InputField
          label="Price (KSh)"
          type="number"
          value={price}
          onChange={(val) => setPrice(Number(val))}
          required
        />

        <InputField
          label="Image URL"
          type="url"
          value={image}
          onChange={setImage}
          required
        />

        <div>
          <label className="block text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-gray-100 p-3 rounded-lg border border-gray-300 focus:outline-indigo-500"
          >
            <option>Chairs</option>
            <option>Tables</option>
            <option>Sofas</option>
            <option>Storage</option>
            <option>Decor</option>
          </select>
        </div>

        <TextAreaField
          label="Description"
          value={description}
          onChange={setDescription}
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>

        {success && (
          <p className="text-green-600 text-center font-medium">
            Product added successfully!
          </p>
        )}
      </form>
    </Panel>
  );
}

/* ------------------------------------------------ */
/* PRODUCTS PANEL                                   */
/* ------------------------------------------------ */

import { Pencil, Trash2, Eye, Check, X } from "lucide-react";
import { Product } from "@/types";

function ProductsPanel() {
  const user = useAuthStore((state) => state.user);
  const products = useStore((state) => state.products);
  const removeProduct = useStore((state) => state.removeProduct); // must add this
  const updateProduct = useStore((state) => state.updateProduct); // must add this

  const vendorProducts = products.filter((p) => p.vendorId === user?.id);

  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<number | null>(null);

  const filtered = vendorProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Panel title="Manage Products">

      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-3 bg-gray-100 border border-gray-300 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Price</th>
              <th className="p-4">Category</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="text-gray-800">
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="p-4">
                  <img
                    src={p.image}
                    className="w-14 h-14 object-cover rounded-md"
                  />
                </td>

                <td className="p-4 font-medium">{p.name}</td>

                <td className="p-4">KSh {p.price}</td>

                <td className="p-4">{p.category}</td>

                {/* Stock toggle */}
                <td className="p-4">
                  <button
                    onClick={() =>
                      updateProduct(p.id, { inStock: !p.inStock })
                    }
                    className={`px-3 py-1 text-xs rounded-full ${
                      p.inStock
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {p.inStock ? "In Stock" : "Out of Stock"}
                  </button>
                </td>

                {/* Action Buttons */}
                <td className="p-4 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setEditing(p.id)}
                    className="p-2 hover:bg-gray-200 rounded-full"
                  >
                    <Pencil className="w-4 h-4 text-indigo-600" />
                  </button>

                  <button
                    onClick={() => removeProduct(p.id)}
                    className="p-2 hover:bg-gray-200 rounded-full"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <EditProductModal
          productId={editing}
          onClose={() => setEditing(null)}
        />
      )}
    </Panel>
  );
}



/* ------------------------------------------------ */
/* GENERIC FORM COMPONENTS                           */
/* ------------------------------------------------ */

function InputField({
  label,
  type = "text",
  value,
  onChange,
  required = false,
}: {
  label: string;
  type?: string;
  value: any;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-gray-700 mb-1">{label}</label>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-100 p-3 rounded-lg border border-gray-300 focus:outline-indigo-500"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-gray-700 mb-1">{label}</label>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-100 p-3 rounded-lg border border-gray-300 focus:outline-indigo-500"
      ></textarea>
    </div>
  );
}

/* ------------------------------------------------ */
/* PLACEHOLDER PANELS                                */
/* ------------------------------------------------ */

function OrdersPanel() {
  return (
    <Panel title="Orders">
      <p className="text-gray-600">Orders will appear here.</p>
    </Panel>
  );
}

function CouponsPanel() {
  return (
    <Panel title="Coupons">
      <p className="text-gray-600">Manage your coupons here.</p>
    </Panel>
  );
}

function ReportsPanel() {
  return (
    <Panel title="Reports">
      <p className="text-gray-600">Analytics and reports.</p>
    </Panel>
  );
}

function ReviewsPanel() {
  return (
    <Panel title="Reviews">
      <p className="text-gray-600">Customer reviews appear here.</p>
    </Panel>
  );
}

function WithdrawPanel() {
  return (
    <Panel title="Withdraw">
      <p className="text-gray-600">Withdraw funds to your bank.</p>
    </Panel>
  );
}

function FollowersPanel() {
  return (
    <Panel title="Followers">
      <p className="text-gray-600">Your followers.</p>
    </Panel>
  );
}

function SubscriptionPanel() {
  return (
    <Panel title="Subscription">
      <p className="text-gray-600">Manage subscription.</p>
    </Panel>
  );
}

function AnnouncementsPanel() {
  return (
    <Panel title="Announcements">
      <p className="text-gray-600">Admin announcements.</p>
    </Panel>
  );
}

function SettingsPanel() {
  return (
    <Panel title="Settings">
      <p className="text-gray-600">Modify your settings.</p>
    </Panel>
  );
}

function ProfilePanel() {
  return (
    <Panel title="My Profile">
      <p className="text-gray-600">Your profile details.</p>
    </Panel>
  );
}

/* ------------------------------------------------ */
/* SHARED PANEL WRAPPER                              */
/* ------------------------------------------------ */

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900">{title}</h2>
      {children}
    </div>
  );
}

/* ------------------------------------------------ */
/* STAT CARD                                         */
/* ------------------------------------------------ */

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <p className="text-gray-600 text-sm">{title}</p>
      <h3 className="text-3xl font-light text-gray-900 mt-2">{value}</h3>
    </div>
  );
}
