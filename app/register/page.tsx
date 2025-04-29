
import React from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import RegisterForm from "./RegisterForm";
import Link from "next/link";
import PageWrapper from "@/components/ui/PageWrapper";

export default async function RegisterPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return (
    <PageWrapper>
      <div className=" max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-center text-gray-900">
          Create your Dubizzle account
        </h1>
        <RegisterForm />
        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-red-600 hover:underline font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
}
