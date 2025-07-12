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

export default function Header() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { setQuery } = useSearch();
  const router = useRouter();
  const pathname = usePathname();

  // Hydration fix for current route
  const [mounted, setMounted] = useState(false);
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
    setQuery(e.target.value);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pathname !== "/productsgallery") {
      router.push("/productsgallery");
    }
  };

  const isActive = (href: string) => mounted && pathname === href;

  return (
    <header className="bg-slate-100/90 dark:bg-base-300/90 backdrop-blur sticky top-0 z-40 shadow">
      <div className="mx-auto w-full flex items-center justify-between px-4 py-2 lg:py-3 max-w-7xl">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center btn btn-ghost text-2xl gap-2 normal-case font-bold"
          prefetch={true}
          onClick={() => 
            toast({
              title: "Welcome",
              description: "Explore our latest products!",
            })
          }
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-full dark:bg-violet-600 bg-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="flex-shrink-0 w-7 h-7 rounded-full dark:text-gray-50 text-blue-700">
              <path d="M18.266 26.068l7.839-7.854 4.469 4.479c1.859 1.859 1.859 4.875 0 6.734l-1.104 1.104c-1.859 1.865-4.875 1.865-6.734 0zM30.563 2.531l-1.109-1.104c-1.859-1.859-4.875-1.859-6.734 0l-6.719 6.734-6.734-6.734c-1.859-1.859-4.875-1.859-6.734 0l-1.104 1.104c-1.859 1.859-1.859 4.875 0 6.734l6.734 6.734-6.734 6.734c-1.859 1.859-1.859 4.875 0 6.734l1.104 1.104c1.859 1.859 4.875 1.859 6.734 0l21.307-21.307c1.859-1.859 1.859-4.875 0-6.734z"></path>
            </svg>
          </div>
          <span className="hidden md:inline italic font-serif tracking-wide text-blue-700 drop-shadow">
            Electech
          </span>
        </Link>

        {/* Search */}
        <div className="w-full max-w-xs px-2">
          <PlaceholdersAndVanishInput
            placeholders={[
              "Search products...",
              "Try 'iPhone'",
              "Try 'Headphones'",
              "Try 'EarPods'",
            ]}
            onChange={handleSearchChange}
            onSubmit={handleSearchSubmit}
          />
        </div>

        

        {/* Desktop Nav */}
        <nav className="hidden lg:flex">
          <ul className="flex items-center gap-2">
            <li>
              <Link
                href="/"
                className={`px-4 py-2 hover:bg-base-200 rounded transition-all duration-150 ${
                  isActive("/") ? "border-b-2 border-blue-700 font-semibold" : ""
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/productsgallery"
                className={`px-4 py-2 hover:bg-base-200 rounded transition-all duration-150 ${
                  isActive("/productsgallery") ? "border-b-2 border-blue-700 font-semibold" : ""
                }`}
              >
                All Products
              </Link>
            </li>
            {session?.user?.role === "admin" && (
              <li>
                <Link
                  href="/admin"
                  className={`px-4 py-2 hover:bg-base-200 rounded transition-all duration-150 ${
                    isActive("/admin") ? "border-b-2 border-blue-700 font-semibold" : ""
                  }`}
                  target="_blank"
                  onClick={() => 
                    toast({
                      title: "Admin Access",
                      description: "You have access to the admin dashboard.",
                    })
                  }
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link
                href="/orders"
                className={`px-4 py-2 hover:bg-base-200 rounded transition-all duration-150 ${
                  isActive("/orders") ? "border-b-2 border-blue-700 font-semibold" : ""
                }`}
                target="_blank"
              >
                My Orders
              </Link>
            </li>
            {session ? (
              <li>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 text-error hover:bg-base-200 w-full text-left rounded"
                >
                  Sign Out
                </button>
              </li>
            ) : (
              <li>
                <Link
                  href="/login"
                  className={`px-4 py-2 hover:bg-base-200 rounded transition-all duration-150 ${
                    isActive("/login") ? "border-b-2 border-blue-700 font-semibold" : ""
                  }`}

                >
                  Login
                </Link>
              </li>
            )}
          </ul>
        </nav>

{/* Cart Icon */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="btn btn-ghost btn-circle relative mr-2"
          aria-label="View cart"
        >
          <ShoppingCart className="w-6 h-6 text-blue-700" />
        </button>

        {/* Hamburger menu (Mobile) */}
        <button
          className="btn btn-ghost btn-circle lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Cart Slide Over */}
        <CartSlideOver open={isCartOpen} setOpen={setIsCartOpen} />

        {/* --- Mobile Nav Overlay --- */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-black/30" onClick={() => setMenuOpen(false)}>
            <div
              className="absolute top-0 right-0 w-72 h-full p-4 rounded-l-xl shadow-lg
                  bg-white dark:bg-base-100/95 border-l border-gray-200 dark:border-base-300 transition-all"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                <XMarkIcon className="w-7 h-7 text-gray-700" />
              </button>
              <ul className="flex flex-col gap-2 mt-10 bg-white">
                <li>
                  <Link
                    href="/"
                    className={`px-4 py-2 hover:bg-base-200 block rounded transition-all duration-150 ${
                      isActive("/") ? "border-b-2 border-blue-700 font-semibold" : ""
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/productsgallery"
                    className={`px-4 py-2 hover:bg-base-200 block rounded transition-all duration-150 ${
                      isActive("/productsgallery") ? "border-b-2 border-blue-700 font-semibold" : ""
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
                      className={`px-4 py-2 hover:bg-base-200 block rounded transition-all duration-150 ${
                        isActive("/admin") ? "border-b-2 border-blue-700 font-semibold" : ""
                      }`}
                      target="_blank"
                      onClick={() => {
                        setMenuOpen(false);
                        toast({
                          title: "Admin Access",
                          description: "You have access to the admin dashboard.",
                        });
                      }}
                    >
                      Admin Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <Link
                    href="/orders"
                    className={`px-4 py-2 hover:bg-base-200 block rounded transition-all duration-150 ${
                      isActive("/orders") ? "border-b-2 border-blue-700 font-semibold" : ""
                    }`}
                    target="_blank"
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
                      className="px-4 py-2 text-error hover:bg-base-200 w-full text-left rounded"
                    >
                      Sign Out
                    </button>
                  </li>
                ) : (
                  <li>
                    <Link
                      href="/login"
                      className={`px-4 py-2 hover:bg-base-200 block rounded transition-all duration-150 ${
                        isActive("/login") ? "border-b-2 border-blue-700 font-semibold" : ""
                      }`}
                      onClick={() => {
                        setMenuOpen(false);
                        toast({
                          title: "Login Required",
                        });
                      }}
                    >
                      Login
                    </Link>
                  </li>
                )}
                <li>
                  <button
                    onClick={() => {
                      setIsCartOpen(true);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Cart</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}