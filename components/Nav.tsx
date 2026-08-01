"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/lib/session";

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { user, logout } = useSession();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" || pathname.startsWith("/games") : pathname.startsWith(href);

  return (
    <>
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
          <Link href="/hall-of-fame" className={isActive("/hall-of-fame") ? "active" : ""}>
            Salón de la Fama
          </Link>
        </div>
        <div className="spacer" />
        <div className="coin-counter">
          <span className="coin" />
          <span>CRÉDITOS · 03</span>
        </div>
        {user ? (
          <button className="btn ghost auth-btn" onClick={logout}>
            {user.name} ▾
          </button>
        ) : (
          <Link href="/auth" className="btn auth-btn">
            Iniciar Sesión
          </Link>
        )}
        <button
          className="btn ghost hamburger"
          onClick={() => setOpen(true)}
          aria-label="Menú"
        >
          ≡
        </button>
      </nav>

      <div
        className={"av-mobile-backdrop" + (open ? " open" : "")}
        onClick={() => setOpen(false)}
      />
      <aside className={"av-mobile-panel" + (open ? " open" : "")}>
        <div className="pixel neon-cyan" style={{ fontSize: 11, marginBottom: 16 }}>
          MENÚ
        </div>
        <Link
          href="/"
          className={isActive("/") ? "active" : ""}
          onClick={() => setOpen(false)}
        >
          Biblioteca
        </Link>
        <Link
          href="/hall-of-fame"
          className={isActive("/hall-of-fame") ? "active" : ""}
          onClick={() => setOpen(false)}
        >
          Salón de la Fama
        </Link>
        {user ? (
          <a
            onClick={() => {
              logout();
              setOpen(false);
            }}
          >
            {user.name} · Cerrar sesión
          </a>
        ) : (
          <Link
            href="/auth"
            className={isActive("/auth") ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            Iniciar Sesión
          </Link>
        )}
        <div style={{ flex: 1 }} />
        <div className="pixel" style={{ fontSize: 9, color: "var(--ink-faint)", letterSpacing: "0.16em" }}>
          CRÉDITOS · 03
        </div>
      </aside>
    </>
  );
}
