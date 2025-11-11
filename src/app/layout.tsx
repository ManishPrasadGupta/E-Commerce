import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Header from "@/components/Navbar/Header";
import { Toaster } from "@/components/ui/toaster";
import AppProviders from "@/components/AppProvider";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes"; // <-- Add this import

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
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
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Radix Theme wrapper here */}
        <Theme appearance="dark" accentColor="blue">
          <Providers>
            <AppProviders>
              <main>
                <Header />
                {children}
              </main>
              <Toaster />
            </AppProviders>
          </Providers>
        </Theme>
        {/* <ChatbotWidgets /> */}
      </body>
    </html>
  );
}
