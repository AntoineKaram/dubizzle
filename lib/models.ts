type User = {
  name: string;
  email: string;
  id: string;
  role: Role;
  address?: string;
  profilePic?: string;
  createdAt: Date;
  createdBy?: string;
  modifiedAt?: Date;
  modifiedBy?: string;
  ads: Ad[];
};

type Ad = {
  id: string;
  title: string;
  price: number;
  createdAt: Date;
  status: AdStatus;
  image: string;
};

interface DetailedAd extends Ad {
  location: string;
  description: string;
  paymentOption: string;
  images: string[];
  subcategory: {
    name: string;
    category: { name: string };
  };
  user?: { name: string };
  createdBy: string;
}

type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
};

type Category = {
  id: string;
  name: string;
  subcategories: Subcategory[];
};

type AdStatus = "PENDING" | "APPROVED" | "REJECTED";
enum Role {
  USER = "USER",
  MODERATOR = "MODERATOR",
}

export type { Ad, Role, User, Category, AdStatus, DetailedAd, Subcategory };
