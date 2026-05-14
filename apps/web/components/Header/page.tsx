"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConnectionMonitor } from "@/hooks/useConnectionMonitor";

export default function Header() {
  const pathname = usePathname();
  const { isConnected, isChecking } = useConnectionMonitor();

  const navItems = [
    { name: "Home", path: "/dashboard", icon: "⌂" },
    { name: "Templates", path: "/templates", icon: "🎨" },
    { name: "Events", path: "/events", icon: "📅" },
  ];

  return (
    <header className="header">
      <div className="inner">
        {/* Logo */}
        <Link href="/dashboard" className="headerLogo">
          <span className="headerLogoP">ప</span>
          <span className="headerLogoRest">looopu</span>
        </Link>

        {/* Nav links */}
        <nav className="headerNav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`headerLink ${pathname === item.path ? "headerLinkActive" : ""}`}
            >
              <span className="headerLinkIcon">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="headerRight">
          {/* STATUS INDICATOR WITH GLOW */}
          <div className="statusContainer">
            {isChecking ? (
              <div className="statusChecking">
                <span className={`statusDot ${isChecking ? "dotAnimating" : ""}`} />
                <span className="statusText">Checking...</span>
              </div>
            ) : isConnected ? (
              <div className="statusOnline">
                <span className="statusDot" />
                <span className="statusText">Live</span>
              </div>
            ) : (
              <div className="statusOffline">
                <span className="statusDot" />
                <span className="statusText">Offline</span>
              </div>
            )}
          </div>

          <Link href="/logout" className="logout">
            ↩ Logout
          </Link>
        </div>
      </div>
    </header>
  );
}