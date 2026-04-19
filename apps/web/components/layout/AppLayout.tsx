"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/page";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideHeaderRoutes = ["/login", "/signup", "/auth"];

  const shouldHideHeader = hideHeaderRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <>
      {!shouldHideHeader && <Header />}
      {children}
    </>
  );
}