import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers/Providers";
import AppLayout from "@/components/layout/AppLayout";
export const metadata: Metadata = {
  title: "Mehfil",
  description: "Send WhatsApp invites at where every gathering begins",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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