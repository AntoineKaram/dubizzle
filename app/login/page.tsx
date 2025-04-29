import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";

import PageWrapper from "@/components/ui/PageWrapper";

import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <PageWrapper>
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center text-gray-900">
          Login to your Dubizzle account
        </h1>
        <LoginForm />
        <p className="text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-red-600 hover:underline font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
}
