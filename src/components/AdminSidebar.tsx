"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import "../app/styles/radio-glider.css";

const links = [
  { href: "/admin/products", label: "Add Product" },
  { href: "/admin/ads", label: "Add Ads" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const selectedIndex = links.findIndex((l) => pathname.startsWith(l.href));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--total-radio", links.length.toString());
    }
  }, []);

  // Sidebar open state for small screens
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Only render after client-side mount to avoid hydration errors
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    // Close sidebar when route changes (optional UX improvement)
    setSidebarOpen(false);
  }, [pathname]);

  if (!mounted) return null;

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        type="button"
        aria-label="Open sidebar"
        className="md:hidden fixed top-24 left-2 z-30 p-2 bg-blue-600 text-white rounded shadow"
        onClick={() => setSidebarOpen(true)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for sidebar on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          transition-transform duration-300 ease-in-out
          fixed top-16left-0 z-50 w-56 min-h-screen border-r bg-gray-50 p-4 flex items-start
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:static md:translate-x-0 md:z-auto md:top-0
        `}
        style={{ maxWidth: "16rem" }}
      >
        {/* Close button on mobile */}
        <button
          type="button"
          aria-label="Close sidebar"
          className="md:hidden absolute top-4 right-4 z-40 p-2 bg-gray-200 rounded"
          onClick={() => setSidebarOpen(false)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="radio-container w-full" ref={containerRef}>
          {links.map((link, idx) => (
            <Link
              key={link.href}
              href={link.href}
              className="sidebar-link block w-full"
              style={{
                position: "relative",
                zIndex: 2,
              }}
              data-active={selectedIndex === idx ? "true" : "false"}
            >
              <span className="block p-4">{link.label}</span>
            </Link>
          ))}
          <div className="glider-container" aria-hidden="true">
            <div
              className="glider"
              style={{
                transform: `translateY(${selectedIndex * 100}%)`,
                height: `calc(100% / ${links.length})`,
              }}
            />
          </div>
        </div>
      </aside>
    </>
  );
}