"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" || pathname.startsWith("/juegos") : pathname.startsWith(href);

  return (
    <nav className="av-nav">
      <Link href="/" className="logo">
        <div className="logo-mark" />
        <div className="logo-text neon-cyan">
          ARCADE <span className="neon-magenta">VAULT</span>
        </div>
      </Link>
      <div className="links">
        <Link href="/" className={isActive("/") ? "active" : ""}>
          Biblioteca
        </Link>
        <Link href="/salon" className={isActive("/salon") ? "active" : ""}>
          Salón de la Fama
        </Link>
      </div>
      <div className="spacer" />
      <div className="coin-counter">
        <span className="coin" />
        <span>CRÉDITOS · 03</span>
      </div>
      <Link href="/auth" className="btn auth-btn">
        Iniciar Sesión
      </Link>
    </nav>
  );
}
