import { Ad, DetailedAd } from "@/lib/models";

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
  }));
}
