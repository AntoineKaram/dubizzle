"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCategories } from "@/store/settingsSlice";
import { api } from "@/lib/axios";
import { LoadScript } from "@react-google-maps/api";

const GlobalInitializer: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data } = await api.get("/api/settings");
        dispatch(setCategories(data.categories));
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    }

    loadSettings();
  }, [dispatch]);

  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={["places"]}
    ></LoadScript>
  );
};
export default GlobalInitializer;
