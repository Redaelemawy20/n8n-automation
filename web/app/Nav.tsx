"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/orders", label: "Orders" },
  { href: "/chat", label: "Chat" },
  { href: "/tts", label: "Ask (voice)" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <nav className="nav">
      {links.map(({ href, label }) => (
        <Link key={href} href={href} aria-current={pathname.startsWith(href) ? "page" : undefined}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
