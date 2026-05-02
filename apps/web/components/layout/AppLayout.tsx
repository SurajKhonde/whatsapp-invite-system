"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header/page";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  
  const hiddenExact = ["/"];
const hiddenPrefix = ["/login", "/signup","/logout","/reset-password","/forgot-password","/reset-new-password","/verify"];

const shouldHideHeader =
  hiddenExact.includes(pathname) ||
  hiddenPrefix.some((r) => pathname.startsWith(r));

  return (
    <>
      {!shouldHideHeader && <Header />}
      {children}
    </>
  );
}