"use client";

import React from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import { Provider } from "react-redux";
import { store } from "@/store/store";

const SessionProvider: React.FC<{
  children: React.ReactNode;
  session?: Session | null;
}> = ({ children, session }) => {
  return (
    <NextAuthSessionProvider session={session}>
      <Provider store={store}>{children}</Provider>
    </NextAuthSessionProvider>
  );
};

export default SessionProvider;
