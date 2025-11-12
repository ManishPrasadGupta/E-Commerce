"use client";

import { usePageLoader } from "@/context/PageLoaderContext/PageLoaderContext";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

import { ReactNode, MouseEvent } from "react";

type CustomLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
};

export default function CustomLink({
  children,
  href,
  className,
  onClick,
  ...props
}: CustomLinkProps) {
  const { showLoader, hideLoader } = usePageLoader();
  const pathname = usePathname();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // If an onClick prop is provided, call it
    if (onClick) {
      onClick(e);
    }

    const targetUrl = href.toString();
    // Show loader only if navigating to a different page
    if (targetUrl !== pathname) {
      showLoader();
      // Hide the loader after a short delay to ensure the transition is visible
      setTimeout(() => hideLoader(), 800);
    }
  };

  return (
    <Link href={href} {...props} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
