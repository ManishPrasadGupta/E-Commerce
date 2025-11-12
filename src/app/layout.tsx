import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import AppProviders from "@/components/AppProvider";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import LoaderShell from "@/components/loader/loaderShell";

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
        <Theme appearance="dark" accentColor="blue">
          <Providers>
            <AppProviders>
              <LoaderShell>{children}</LoaderShell>
            </AppProviders>
          </Providers>
        </Theme>
      </body>
    </html>
  );
}
