"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, ShoppingCart } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import CartSlideOver from "../Cart/CartSlideOver";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSearch } from "@/context/SearchContext/SearchContext";
import { usePathname, useRouter } from "next/navigation";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import { toast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { setQuery } = useSearch();
  const router = useRouter();
  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
    } catch {
      toast({
        title: "Error",
        description: "Failed to sign out",
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setQuery(e.target.value);
  };

  const triggerSearch = () => {
    if (pathname !== "/productsgallery") {
      router.push("/productsgallery");
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      triggerSearch();
    }
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    triggerSearch();
  };

  const isActive = (href: string) => mounted && pathname === href;

  return (
    <header
      className="sticky top-0 w-full z-40 bg-gradient-to-b from-blue-900/95 via-slate-900/90 to-blue-900/70
      border-b border-blue-600/30 backdrop-blur shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 lg:py-4 gap-4">
        {/* Left Side: Logo */}
        <div className="flex-shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl shadow-sm bg-gradient-to-r from-blue-700/80 to-cyan-500/60 py-2 px-3 hover:brightness-110 transition hover:scale-105"
            onClick={() =>
              toast({
                title: "Welcome",
                description: "Explore our latest products!",
              })
            }
          >
            <span className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 via-cyan-300 to-sky-500 shadow-inner">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                fill="currentColor"
                className="flex-shrink-0 w-6 h-6 text-white"
              >
                <path d="M18.266 26.068l7.839-7.854 4.469 4.479c1.859 1.859 1.859 4.875 0 6.734l-1.104 1.104c-1.859 1.865-4.875 1.865-6.734 0zM30.563 2.531l-1.109-1.104c-1.859-1.859-4.875-1.859-6.734 0l-6.719 6.734-6.734-6.734c-1.859-1.859-4.875-1.859-6.734 0l-1.104 1.104c-1.859 1.859-1.859 4.875 0 6.734l6.734 6.734-6.734 6.734c-1.859 1.859-1.859 4.875 0 6.734l1.104 1.104c1.859 1.859 4.875 1.859 6.734 0l21.307-21.307c1.859-1.859 1.859-4.875 0-6.734z"></path>
              </svg>
            </span>
            <span className="hidden md:inline italic font-serif tracking-wide bg-gradient-to-r from-cyan-300 to-blue-400 text-transparent bg-clip-text text-2xl font-bold drop-shadow">
              Electech
            </span>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="flex-1 flex justify-center px-4 lg:px-6">
          <div className="w-full max-w-md">
            <form onSubmit={handleSearchSubmit}>
              <PlaceholdersAndVanishInput
                placeholders={[
                  "Search products...",
                  "Try 'iPhone'",
                  "Try 'Headphones'",
                  "Try 'EarPods'",
                ]}
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
              />
            </form>
          </div>
        </div>

        {/* Right Side: Nav and Actions */}
        <div className="flex items-center justify-end flex-shrink-0">
          <nav className="hidden lg:flex items-center">
            <ul className="flex items-center gap-1">
              <li>
                <Link
                  href="/"
                  className={`px-4 py-2 rounded-full font-medium transition ${
                    isActive("/")
                      ? "bg-blue-700/80 text-cyan-200 shadow-md"
                      : "text-white hover:bg-blue-800/60"
                  }`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/productsgallery"
                  className={`px-4 py-2 rounded-full font-medium transition ${
                    isActive("/productsgallery")
                      ? "bg-blue-700/80 text-cyan-200 shadow-md"
                      : "text-white hover:bg-blue-800/60"
                  }`}
                >
                  All Products
                </Link>
              </li>
              {session?.user?.role === "admin" && (
                <li>
                  <Link
                    href="/admin"
                    target="_blank"
                    className={`px-4 py-2 rounded-full font-medium transition ${
                      isActive("/admin")
                        ? "bg-blue-700/80 text-cyan-200 shadow-md"
                        : "text-white hover:bg-blue-800/60"
                    }`}
                  >
                    Admin
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/orders"
                  className={`px-4 py-2 rounded-full font-medium transition ${
                    isActive("/orders")
                      ? "bg-blue-700/80 text-cyan-200 shadow-md"
                      : "text-white hover:bg-blue-800/60"
                  }`}
                >
                  My Orders
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2 ml-2">
            {session ? (
              <div className="hidden lg:block">
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-red-500 to-red-700 text-white font-medium hover:brightness-90 shadow-md transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="hidden lg:block">
                <Link
                  href="/login"
                  className={`px-4 py-2 rounded-full font-medium transition ${
                    isActive("/login")
                      ? "bg-blue-700/80 text-cyan-200 shadow-md"
                      : "text-white hover:bg-blue-800/60"
                  }`}
                >
                  Login
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full bg-gradient-to-br from-blue-700 via-cyan-500 to-sky-500 shadow-lg p-2.5 hover:brightness-110 hover:scale-110 transition"
              aria-label="View cart"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
            </button>

            <button
              className="rounded-full bg-slate-800/80 p-2 shadow-lg lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-7 h-7 text-cyan-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Cart Slide Over */}
      <CartSlideOver open={isCartOpen} setOpen={setIsCartOpen} />

      {/* --- Mobile Nav Overlay --- */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur"
          onClick={() => setMenuOpen(false)}
        >
          <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ duration: 0.26, ease: "easeOut" }}
            className="absolute top-0 right-0 w-72 h-full p-5 rounded-l-2xl shadow-2xl bg-gradient-to-b from-blue-900/95 via-slate-900/90 to-blue-900/80 border-l border-blue-600/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-4 bg-slate-800/50 rounded-full p-2"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              <XMarkIcon className="w-7 h-7 text-white" />
            </button>
            <ul className="flex flex-col gap-3 mt-12">
              <li>
                <Link
                  href="/"
                  className={`block px-4 py-2 rounded-full font-medium transition ${
                    isActive("/")
                      ? "bg-blue-700/80 text-cyan-200"
                      : "bg-slate-800/70 text-white"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/productsgallery"
                  className={`block px-4 py-2 rounded-full font-medium transition ${
                    isActive("/productsgallery")
                      ? "bg-blue-700/80 text-cyan-200"
                      : "bg-slate-800/70 text-white"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  All Products
                </Link>
              </li>
              {session?.user?.role === "admin" && (
                <li>
                  <Link
                    href="/admin"
                    target="_blank"
                    className="block px-4 py-2 rounded-full font-medium bg-slate-800/70 text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link
                  href="/orders"
                  className={`block px-4 py-2 rounded-full font-medium transition ${
                    isActive("/orders")
                      ? "bg-blue-700/80 text-cyan-200"
                      : "bg-slate-800/70 text-white"
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  My Orders
                </Link>
              </li>
              {session ? (
                <li>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 rounded-full bg-red-600 text-white font-medium"
                  >
                    Sign Out
                  </button>
                </li>
              ) : (
                <li>
                  <Link
                    href="/login"
                    className={`block px-4 py-2 rounded-full font-medium transition ${
                      isActive("/login")
                        ? "bg-blue-700/80 text-cyan-200"
                        : "bg-slate-800/70 text-white"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        </div>
      )}
    </header>
  );
}
