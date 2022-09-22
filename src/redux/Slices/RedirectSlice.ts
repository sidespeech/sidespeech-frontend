import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Redirect {
  to: string | null;
}

const initialState: Redirect = {
  to: null,
};

export const redirectSlice = createSlice({
  name: "redirect",
  initialState,
  reducers: {
    redirect: (state: Redirect, action: PayloadAction<any>) => {
      state.to = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { redirect } = redirectSlice.actions;

export default redirectSlice.reducer;
