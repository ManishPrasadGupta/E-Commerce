"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNotification } from "./Notification";
import CartSlideOver from "./Cart/CartSlideOver";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useSearch } from "@/context/SearchContext/SearchContext";
import { usePathname, useRouter } from "next/navigation";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

export default function Header() {
  
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [menuOpen, setMenuOpen] = useState(false); 
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  const { setQuery } = useSearch();
  const router = useRouter();
  const pathname = usePathname();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pathname !== "/productsgallery") {
      router.push("/productsgallery");
    }
    
  };

  return (
    <div className="bg-slate-200 navbar bg-base-300 sticky top-0 z-40">
      <div className="mx-auto w-full flex items-center justify-between p-4">
      <Link
        href="/"
        className="flex items-center btn btn-ghost text-3xl gap-2 normal-case font-bold"
        prefetch={true}
        onClick={() => showNotification("Welcome to Electronics", "info")}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full dark:bg-violet-600">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" className="flex-shrink-0 w-5 h-5 rounded-full dark:text-gray-50">
						<path d="M18.266 26.068l7.839-7.854 4.469 4.479c1.859 1.859 1.859 4.875 0 6.734l-1.104 1.104c-1.859 1.865-4.875 1.865-6.734 0zM30.563 2.531l-1.109-1.104c-1.859-1.859-4.875-1.859-6.734 0l-6.719 6.734-6.734-6.734c-1.859-1.859-4.875-1.859-6.734 0l-1.104 1.104c-1.859 1.859-1.859 4.875 0 6.734l6.734 6.734-6.734 6.734c-1.859 1.859-1.859 4.875 0 6.734l1.104 1.104c1.859 1.859 4.875 1.859 6.734 0l21.307-21.307c1.859-1.859 1.859-4.875 0-6.734z"></path>
					</svg>
				</div>
        <span className="hidden md:inline italic font-serif tracking-wide text-blue-700 drop-shadow">
          Electronics
        </span>
      </Link>
        
        <div className="w-full max-w-xs">
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


        <button
          className="btn btn-ghost btn-circle lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Dropdown menu with toggle functionality */}
        <div className={`bg-white absolute top-16 right-4 bg-base-100 shadow-lg rounded-box w-64 p-2 transition-all ${menuOpen ? "block" : "hidden"} lg:flex lg:relative lg:top-0 lg:right-0 lg:w-auto lg:p-0 lg:shadow-none lg:bg-transparent`}>

        <button
            className="absolute top-2 right-2 lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <XMarkIcon className="w-6 h-6 text-gray-700" />
        </button>
          <ul className="flex flex-col lg:flex-row lg:items-center gap-2">
            <li>
              <Link href="/" className="px-4 py-2 hover:bg-base-200 block w-full">Home</Link>
            </li>
            <li>
              <Link 
                href="/productsgallery" 
                className="px-4 py-2 hover:bg-base-200 block w-full"
                onClick={e => {
                  e.preventDefault();
                  window.location.href = "/productsgallery";
                }}
              >
                All Products
              </Link>
            </li>
            {session?.user?.role === "admin" && (
              <li>
                <Link
                  href="/admin"
                  className="px-4 py-2 hover:bg-base-200 block w-full"
                  target="_blank"
                  onClick={() => showNotification("Welcome to Admin Dashboard", "info")}
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
            <li>
              <Link href="/orders" className="px-4 py-2 hover:bg-base-200 block w-full" target="_blank">My Orders</Link>
            </li>
            {session ? (
              <li>
                <button onClick={handleSignOut} className="px-4 py-2 text-error hover:bg-base-200 w-full text-left">Sign Out</button>
              </li>
            ) : (
              <li>
                <Link
                  href="/login"
                  className="px-4 py-2 hover:bg-base-200 block w-full"
                  onClick={() => showNotification("Please sign in to continue", "info")}
                >
                  Login
                </Link>
              </li>
              
            )}
            <li>
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
            > 
              View Cart
            </button>
            </li>
            <CartSlideOver open={isCartOpen} setOpen={setIsCartOpen} />
          </ul>
        </div>
      </div>
    </div>
  );
}
