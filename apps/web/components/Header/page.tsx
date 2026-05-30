"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useConnectionMonitor } from "@/hooks/useConnectionMonitor";
import styles from "./header.module.css";

const navItems = [
  { name: "Home",      path: "/dashboard", icon: "⌂"  },
  { name: "Templates", path: "/templates", icon: "🎨" },
  { name: "Events",    path: "/events",    icon: "📅" },
];

export default function Header() {
  const pathname = usePathname();
  const state = useConnectionMonitor();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        <Link href="/dashboard" className={styles.logo} onClick={() => setMenuOpen(false)}>
          <span className={styles.logoP}>ప</span>
          <span className={styles.logoRest}>looopu</span>
        </Link>

        {/* Desktop nav */}
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`${styles.link} ${pathname === item.path ? styles.linkActive : ""}`}
            >
              <span className={styles.linkIcon}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className={styles.right}>
          <div className={styles.statusContainer}>
            {state === "reconnecting" ? (
              <div className={styles.statusChecking}>
                <span className={`${styles.statusDot} ${styles.dotAnimating}`} />
                <span className={styles.statusText}>Reconnecting…</span>
              </div>
            ) : state === "disconnected" ? (
              <div className={styles.statusOffline}>
                <span className={styles.statusDot} />
                <span className={styles.statusText}>Offline</span>
              </div>
            ) : (
              <div className={styles.statusOnline}>
                <span className={styles.statusDot} />
                <span className={styles.statusText}>Live</span>
              </div>
            )}
          </div>

          <Link href="/logout" className={styles.logout}>↩ Logout</Link>

          {/* Hamburger button — only shows on mobile */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Menu"
          >
            <span className={`${styles.bar} ${menuOpen ? styles.bar1Open : ""}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.bar2Open : ""}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.bar3Open : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className={styles.mobileDropdown}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              onClick={() => setMenuOpen(false)}
              className={`${styles.mobileLink} ${pathname === item.path ? styles.mobileLinkActive : ""}`}
            >
              <span className={styles.linkIcon}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}