"use client";

// components/layout/AppLayout.tsx
// Add OfflineBanner here — it renders on every page automatically

import { usePathname } from "next/navigation";
import Header from "@/components/Header/page";
import OfflineBanner from "@/components/OfflineBanner"; // ✅ ADD THIS

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hiddenExact = ["/"];
  const hiddenPrefix = [
    "/login",
    "/signup",
    "/logout",
    "/reset-password",
    "/forgot-password",
    "/reset-new-password",
    "/verify",
  ];

  const shouldHideHeader =
    hiddenExact.includes(pathname) || hiddenPrefix.some((r) => pathname.startsWith(r));

  return (
    <>
      {/* ✅ OfflineBanner shows on ALL pages including login/signup */}
      <OfflineBanner />

      {!shouldHideHeader && <Header />}
      {children}
    </>
  );
}
