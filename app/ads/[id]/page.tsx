import { notFound } from "next/navigation";
import { getAdById } from "@/lib/helper";
import { getCurrentUser } from "@/lib/auth";

import PageWrapper from "@/components/ui/PageWrapper";

import AdEditForm from "./AdEditForm";
import AdDetailView from "./AdDetailView";

interface PageProps {
  params: { id: string };
}

export default async function AdDetailPage({ params }: PageProps) {
  const user = await getCurrentUser();
  const { id: adId } = await params;
  const ad = await getAdById(adId);
  if (!ad) return notFound();

  const isOwner = user?.id === ad.createdBy;
  const isModerator = user?.role === "MODERATOR";

  return (
    <PageWrapper>
      {isOwner ? (
        <AdEditForm ad={ad} />
      ) : isModerator ? (
        <div>Moderator panel coming soon</div>
      ) : (
        <AdDetailView ad={ad} />
      )}
    </PageWrapper>
  );
}
