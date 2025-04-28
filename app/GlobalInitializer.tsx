"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCategories } from "@/store/settingsSlice";
import { api } from "@/lib/axios";

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

  return null;
};
export default GlobalInitializer;
