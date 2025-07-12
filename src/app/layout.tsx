import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import Providers from "@/components/Providers";
// import  { NotificationProvider } from "@/components/Notification";
import Header from "@/components/Navbar/Header";
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext/SearchContext";
import ChatbotWidgets from "@/components/ChatBot/ChatbotWidgets";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Electronics",
  description: "Shop for Electronics Items",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <SearchProvider>
            <CartProvider>
                <main>
                  <Header />
                  {children}
                </main>
              <Toaster />
            </CartProvider>
          </SearchProvider>
        </Providers>
        {/* <ChatbotWidgets /> */}
      </body>
    </html>
  );
}
