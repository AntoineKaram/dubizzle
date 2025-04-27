import React from "react";

import Navbar from "@/components/ui/Navbar";
import { SessionProvider } from "@/components/SessionPtovider";

import "./globals.css";

export const metadata = {
  title: "Dubizzle",
  description: "Ads Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
