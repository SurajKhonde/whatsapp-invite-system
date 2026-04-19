import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers/Providers";
import AppLayout from "@/components/layout/AppLayout";
export const metadata: Metadata = {
  title: "InviteFlow 🚀",
  description: "Send WhatsApp invites at scale",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hindi">
      <body>
        <Providers>
         <AppLayout>{children}</AppLayout> 
         </Providers>
      </body>
    </html>
  );
}