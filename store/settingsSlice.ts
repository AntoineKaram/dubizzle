"use client";

import { Category } from "@/lib/models";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SettingsState = {
  categories: Category[];
  paymentOptions: string[];
};

const initialState: SettingsState = {
  categories: [],
  paymentOptions: ["Cash", "Installments", "Cheque", "Other"],
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setCategories(state, action: PayloadAction<Category[]>) {
      state.categories = action.payload;
    },
  },
});

export const { setCategories } = settingsSlice.actions;
export default settingsSlice.reducer;
