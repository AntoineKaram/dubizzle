import { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { Role, User } from "./models";
import { prisma } from "./prisma";
import { comparePassword } from "./hash";
import { mapApiAdsToLightAds } from "./mapper";

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) return null;
  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  return dbUser || null;
};

export async function getEnrichedUser(): Promise<User | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) return null;

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      address: true,
      profilePic: true,
      createdAt: true,
      createdBy: true,
      modifiedAt: true,
      modifiedBy: true,
      ads: {
        select: {
          id: true,
          title: true,
          price: true,
          status: true,
          createdAt: true,
          images: true,
        },
      },
    },
  });

  if (!dbUser) return null;
  const userAds = mapApiAdsToLightAds(dbUser.ads);
  return {
    id: dbUser.id,
    name: dbUser.name,
    email: dbUser.email,
    role: dbUser.role as Role,
    address: dbUser.address ?? undefined,
    profilePic: dbUser.profilePic ?? undefined,
    createdAt: dbUser.createdAt,
    createdBy: dbUser.createdBy ?? undefined,
    modifiedAt: dbUser.modifiedAt ?? undefined,
    modifiedBy: dbUser.modifiedBy ?? undefined,
    ads: userAds,
  };
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const isValid = await comparePassword(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
};
