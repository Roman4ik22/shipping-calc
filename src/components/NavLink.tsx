"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({
  href,
  className,
  activeClassName,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  activeClassName?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname === href + "/";

  if (isActive) {
    return (
      <span className={activeClassName || className} aria-current="page">
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
