import React from "react";
import { redirect } from "next/navigation";
import { getEnrichedUser } from "@/lib/auth";
import PageWrapper from "@/components/ui/PageWrapper";
import ProfileContent from "./ProfileContent";

export default async function ProfilePage() {
  const user = await getEnrichedUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <PageWrapper>
      <ProfileContent user={user} />
    </PageWrapper>
  );
}
