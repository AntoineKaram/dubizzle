"use client";

import { Fragment, useState } from "react";
import dayjs from "dayjs";
import Image from "next/image";
import { signOut } from "next-auth/react";

import { User } from "@/lib/models";
import Button from "@/components/ui/Button";

import MyAds from "./MyAds";
import EditProfileForm from "./EditProfileForm";

export default function ProfileContent({ user }: { user: User }) {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="w-full max-w-6xl min-h-[60vh] mx-auto p-6 flex flex-col md:flex-row gap-10 bg-white rounded-lg shadow-md">
      <div className="flex flex-col items-center md:items-start w-full md:w-1/3 space-y-6">
        {!editMode ? (
          <Fragment>
            <div className="relative w-32 h-32">
              <Image
                src={user.profilePic || "/default-profile.png"}
                alt="Profile Picture"
                fill
                className="object-cover rounded-full border-4 border-red-600"
              />
            </div>
            <div className="text-center md:text-left space-y-1">
              <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-gray-500">
                {user.address || "No address provided yet."}
              </p>
            </div>
            <div className="space-y-1 text-sm text-gray-500 text-center md:text-left">
              <p>
                <span className="font-semibold">Created:</span>{" "}
                {dayjs(user.createdAt).format("DD MMM YYYY, HH:mm")}
              </p>
              {user.modifiedAt && (
                <p>
                  <span className="font-semibold">Last Modified:</span>{" "}
                  {dayjs(user.modifiedAt).format("DD MMM YYYY, HH:mm")}
                </p>
              )}
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-6 w-full">
              <Button
                variant="secondary"
                onClick={() => setEditMode(true)}
                className="w-full md:w-auto"
              >
                Edit Profile
              </Button>
              <Button
                variant="primary"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full md:w-auto"
              >
                Logout
              </Button>
            </div>
          </Fragment>
        ) : (
          <EditProfileForm user={user} onCancel={() => setEditMode(false)} />
        )}
      </div>
      <MyAds ads={user.ads} />
    </div>
  );
}
