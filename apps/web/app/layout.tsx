import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers/Providers";
import AppLayout from "@/components/layout/AppLayout";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "పిlooopu",
  description: "Send beautiful invites",
  icons: {
  icon: [
    { url: "/favicon.svg", type: "image/svg+xml" },
    { url: "/favicon.ico", type: "image/x-icon" },
  ],
  shortcut: "/favicon.svg",
  apple: "/apple-touch-icon.svg",
},
appleWebApp: {
  capable: true,
  statusBarStyle: "black-translucent",
  title: "పిlooopu",
},
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppLayout>{children}</AppLayout>
        </Providers>
      </body>
    </html>
  );
}
