"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import ModeratorPage from "./ModeratorPage";
import PageWrapper from "@/components/ui/PageWrapper";

export default function page() {
  const router = useRouter();
  const { data: session } = useSession();

  const user = session?.user;
  if (!user || user.role !== "MODERATOR") {
    router.push("/login");
    return <PageWrapper>Access Denied</PageWrapper>;
  }
  return (
    <PageWrapper>
      <ModeratorPage userId={user.id} />
    </PageWrapper>
  );
}
