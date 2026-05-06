"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home",      path: "/dashboard", icon: "⌂"  },
    { name: "Templates", path: "/templates", icon: "🎨" },
    { name: "Events",    path: "/events",    icon: "📅" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');

        .hdr {
          position: sticky; top: 0; z-index: 99;
          background: rgba(13,8,16,0.88);
          border-bottom: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          font-family: 'DM Sans', sans-serif;
        }
        .hdr-inner {
          max-width: 1400px; margin: 0 auto;
          padding: 0 28px; height: 62px;
          display: flex; align-items: center; justify-content: space-between;
        }

        /* Logo */
        .hdr-logo {
          font-size: 22px; font-weight: 900;
          text-decoration: none;
          font-family: 'Playfair Display', Georgia, serif;
          display: flex; align-items: center; gap: 1px;
        }
        .hdr-logo-p    { color: #e91e8c; }
        .hdr-logo-rest { color: #f5f0ff; }

        /* Nav */
        .hdr-nav { display: flex; align-items: center; gap: 3px; }
        .hdr-link {
          display: flex; align-items: center; gap: 6px;
          padding: 7px 14px; border-radius: 10px;
          font-size: 13px; font-weight: 500;
          color: rgba(245,240,255,0.4);
          text-decoration: none;
          border: 1px solid transparent;
          transition: all 0.15s;
        }
        .hdr-link:hover { color: #f5f0ff; background: rgba(255,255,255,0.05); }
        .hdr-link.active {
          color: #e91e8c;
          background: rgba(233,30,140,0.1);
          border-color: rgba(233,30,140,0.2);
        }

        /* Right side */
        .hdr-right { display: flex; align-items: center; gap: 12px; }
        .hdr-live {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: rgba(245,240,255,0.22);
          letter-spacing: 0.05em;
        }
        .hdr-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 6px rgba(34,197,94,0.6);
          animation: pdot 2.5s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes pdot {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:0.4; transform:scale(1.5); }
        }
        .hdr-logout {
          display: flex; align-items: center; gap: 5px;
          padding: 7px 16px; border-radius: 10px;
          font-size: 13px; font-weight: 500;
          color: rgba(245,240,255,0.35);
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.08);
          transition: all 0.15s;
        }
        .hdr-logout:hover {
          color: #f87171;
          border-color: rgba(248,113,113,0.25);
          background: rgba(248,113,113,0.05);
        }

        @media (max-width: 640px) { .hdr-nav { display: none; } }
      `}</style>

      <header className="hdr">
        <div className="hdr-inner">

          {/* Logo */}
          <Link href="/dashboard" className="hdr-logo">
            <span className="hdr-logo-p">పి</span>
            <span className="hdr-logo-rest">loopu</span>
          </Link>

          {/* Nav links */}
          <nav className="hdr-nav">
            {navItems.map(item => (
              <Link
                key={item.path}
                href={item.path}
                className={`hdr-link ${pathname === item.path ? "active" : ""}`}
              >
                <span style={{ fontSize: 13 }}>{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="hdr-right">
            <div className="hdr-live">
              <div className="hdr-dot" />
              Live
            </div>
            <Link href="/logout" className="hdr-logout">
              ↩ Logout
            </Link>
          </div>

        </div>
      </header>
    </>
  );
}