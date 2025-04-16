"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User, Menu } from "lucide-react";
import { useState } from "react";
import { useNotification } from "./Notification";
import CartSlideOver from "./Cart/CartSlideOver";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [menuOpen, setMenuOpen] = useState(false); // Added state for toggling the menu

  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <div className="bg-slate-200 navbar bg-base-300 sticky top-0 z-40">
      <div className="mx-auto w-full flex items-center justify-between p-4">
        <Link
          href="/"
          className="flex items-center btn btn-ghost text-3xl gap-2 normal-case font-bold"
          prefetch={true}
          onClick={() => showNotification("Welcome to ImageKit Shop", "info")}
        >
          <Home className="w-5 h-5" />
          Shiwam Electronics
        </Link>
        
        {/* Added hamburger menu button for mobile and desktop */}
        <button
          className="btn btn-ghost btn-circle lg:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Dropdown menu with toggle functionality */}
        <div className={`bg-white absolute top-16 right-4 bg-base-100 shadow-lg rounded-box w-64 p-2 transition-all ${menuOpen ? "block" : "hidden"} lg:flex lg:relative lg:top-0 lg:right-0 lg:w-auto lg:p-0 lg:shadow-none lg:bg-transparent`}>
          <ul className="flex flex-col lg:flex-row lg:items-center gap-2">
            <li>
              <Link href="/" className="px-4 py-2 hover:bg-base-200 block w-full">Home</Link>
            </li>
            <li>
              <Link href="/productsgallery" className="px-4 py-2 hover:bg-base-200 block w-full">All Products</Link>
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
