import { Ad, AdEditRequest, DetailedAd } from "@/lib/models";
import { AdEditRequest as APIEditRequest, Ad as APIAd } from "@prisma/client";

export function mapApiAdToDetailedAd(apiAd: any): DetailedAd {
  return {
    id: apiAd.id,
    title: apiAd.title,
    description: apiAd.description,
    price: apiAd.price,
    location: apiAd.location,
    paymentOption: apiAd.paymentOption,
    images: apiAd.images,
    createdAt: new Date(apiAd.createdAt),
    status: apiAd.status,
    subcategory: {
      name: apiAd.subcategory?.name || "",
      category: {
        name: apiAd.subcategory?.category?.name || "",
      },
    },
    user: apiAd.user ? { name: apiAd.user.name } : undefined,
    createdBy: apiAd.user ? apiAd.user.id : undefined,
    modifiedAt: apiAd.modifiedAt,
    modifiedBy: apiAd.modifiedBy,
    image: apiAd.images.length > 0 ? apiAd.images[0] : "",
  };
}
export function mapApiAdsToLightAds(apiAds: any[]): Ad[] {
  return apiAds.map((apiAd) => ({
    id: apiAd.id,
    title: apiAd.title,
    price: apiAd.price,
    status: apiAd.status,
    location: apiAd.location,
    createdAt: new Date(apiAd.createdAt),
    image: apiAd.images.length > 0 ? apiAd.images[0] : "",
    user: apiAd.user ? { name: apiAd.user.name } : undefined,
  }));
}

export function mapApiAdToAdEditRequest(
  apiAds: ({ ad: APIAd } & APIEditRequest)[]
): AdEditRequest[] {
  return apiAds.map((apiAd) => ({
    id: apiAd.id,
    title: apiAd.title,
    price: apiAd.price,
    status: apiAd.status,
    location: apiAd.location,
    createdAt: new Date(apiAd.createdAt),
    image: apiAd.images.length > 0 ? apiAd.images[0] : "",
    createdBy: apiAd.createdBy,
    description: apiAd.description,
    images: apiAd.images,
    paymentOption: apiAd.paymentOption,
    originalAd: mapApiAdToDetailedAd(apiAd.ad),
  }));
}
