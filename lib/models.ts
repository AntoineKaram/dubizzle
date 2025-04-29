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
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
};

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

enum Role {
  USER = "USER",
  MODERATOR = "MODERATOR",
}

export type { User, Role, Ad, Subcategory, Category };
