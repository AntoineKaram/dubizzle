import { notFound } from "next/navigation";

import { getAdById } from "@/lib/helper";
import { getCurrentUser } from "@/lib/auth";

import PageWrapper from "@/components/ui/PageWrapper";

import AdEditForm from "./AdEditForm";
import AdDetailView from "./AdDetailView";
import ModeratorPanel from "./ModeratorPanel";

export default async function AdDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
        <div className="space-y-6">
          <ModeratorPanel adId={ad.id} currentStatus={ad.status} />
          <AdDetailView ad={ad} />
        </div>
      ) : (
        <AdDetailView ad={ad} />
      )}
    </PageWrapper>
  );
}
