"use client"
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import ModeratorPage from "./ModeratorPage";
import PageWrapper from "@/components/ui/PageWrapper";

export default function page() {
  const { data: session } = useSession();
  const user = session?.user;
  if (!user || user.role !== "MODERATOR") {
    redirect("/login");
  }
  return (
    <PageWrapper>
      <ModeratorPage userId={user.id} />
    </PageWrapper>
  );
}
