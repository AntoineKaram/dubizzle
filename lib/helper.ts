import { prisma } from "@/lib/prisma";
import { Ad, DetailedAd } from "@/lib/models";
import { mapApiAdsToLightAds, mapApiAdToDetailedAd } from "./mapper";

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

  return mapApiAdToDetailedAd(ad);
}