import React from "react";

import Navbar from "@/components/ui/Navbar";
import GlobalInitializer from "./GlobalInitializer";
import SessionProvider from "@/components/SessionProvider";

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
          <GlobalInitializer />
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
