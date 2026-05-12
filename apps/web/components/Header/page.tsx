"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./header.module.css";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/dashboard", icon: "⌂" },
    { name: "Templates", path: "/templates", icon: "🎨" },
    { name: "Events", path: "/events", icon: "📅" },
  ];

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/dashboard" className={styles.logo}>
          <span className={styles.logoP}>పి</span>
          <span className={styles.logoRest}>looopu</span>
        </Link>

        {/* Nav links */}
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

        {/* Right */}
        <div className={styles.right}>
          <div className={styles.live}>
            <div className={styles.dot} />
            Live
          </div>
          <Link href="/logout" className={styles.logout}>
            ↩ Logout
          </Link>
        </div>
      </div>
    </header>
  );
}