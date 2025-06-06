import { prisma } from "@/lib/prisma";
import { Ad, AdEditRequest, DetailedAd } from "@/lib/models";
import {
  mapApiAdsToLightAds,
  mapApiAdToAdEditRequest,
  mapApiAdToDetailedAd,
} from "./mapper";

export async function getAllApprovedAds(
  q: string,
  categoryId: string | undefined,
  subcategoryId: string | undefined,
  minPrice: number,
  maxPrice: number,
  offset: number,
  limit: number
): Promise<Ad[]> {
  const data = await prisma.ad.findMany({
    where: {
      status: "APPROVED",
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { location: { contains: q, mode: "insensitive" } },
        ],
      }),
      ...(categoryId && {
        subcategory: {
          categoryId,
        },
      }),
      ...(subcategoryId && {
        subcategoryId,
      }),
      price: {
        gte: minPrice,
        lte: maxPrice,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    skip: offset,
    take: limit,
    select: {
      id: true,
      title: true,
      price: true,
      location: true,
      images: true,
      createdAt: true,
      subcategory: {
        select: { name: true },
      },
      paymentOption: true,
    },
  });

  const ads: Ad[] = mapApiAdsToLightAds(data);
  return ads;
}

export async function getAdById(id: string): Promise<DetailedAd | null> {
  const ad = await prisma.ad.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      location: true,
      paymentOption: true,
      images: true,
      status: true,
      createdBy: true,
      modifiedAt: true,
      modifiedBy: true,
      createdAt: true,
      subcategory: {
        select: {
          name: true,
          category: {
            select: { name: true },
          },
        },
      },
      user: {
        select: {
          name: true,
          id: true,
        },
      },
    },
  });

  if (!ad) {
    return null;
  }
  if (ad.modifiedBy) {
    const user = await prisma.user.findUnique({
      where: { id: ad.modifiedBy },
      select: {
        name: true,
      },
    });
    ad.modifiedBy = user?.name ?? ad.modifiedBy;
  }

  return mapApiAdToDetailedAd(ad);
}
export async function getPendingAdDetailsByAdId(
  adId: string
): Promise<AdEditRequest | null> {
  const editRequest = await prisma.adEditRequest.findFirst({
    where: { adId: adId, status: "PENDING" },
    include: {
      ad: true,
    },
  });
  if (!editRequest) {
    return null;
  }
  const ads = mapApiAdToAdEditRequest([editRequest]);
  return ads[0];
}

export async function getPendingAds(
  userId: string,
  sortField: string,
  sortDirection: string,
  offset: number,
  limit: number
): Promise<{ ads: DetailedAd[]; total: number }> {
  const data = await prisma.ad.findMany({
    where: {
      status: "PENDING",
      NOT: { createdBy: userId },
    },
    orderBy: {
      [sortField]: sortDirection,
    },
    skip: offset,
    take: limit,
    include: {
      subcategory: { include: { category: true } },
      user: { select: { name: true } },
    },
  });
  const total = await prisma.ad.count({
    where: {
      status: "PENDING",
      NOT: { createdBy: userId },
    },
  });
  const ads = data.map((ad) => mapApiAdToDetailedAd(ad));
  return { ads, total };
}
