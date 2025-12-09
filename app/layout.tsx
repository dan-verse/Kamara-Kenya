import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Suspense } from "react";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Kamara - Where Every Space Tells Your Story",
  description: "Discover timeless furniture pieces that transform your house into a home. Shop our curated collection of sofas, tables, chairs, and more.",
  keywords: ["furniture", "home decor", "interior design", "modern furniture", "vintage furniture"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-white text-gray-900" suppressHydrationWarning={true}>
        <Suspense fallback={null}>
          <Navigation />
        </Suspense>

        <main className="min-h-screen">
          <Suspense>
            {children}
          </Suspense>
          
        </main>
        <Footer />
      </body>
    </html>
  );
}