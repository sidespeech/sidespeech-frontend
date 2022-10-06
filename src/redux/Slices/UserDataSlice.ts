import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { UserTokensData } from "../../models/UserTokensData";
import { User } from "../../models/User";
import { Profile } from "../../models/Profile";
import { Side } from "../../models/Side";

export interface UserData {
  user: User | null;
  profiles: Profile[];
  account: string | null;
  userTokens: UserTokensData | null;
  sides: Side[];
}

const initialState: UserData = {
  user: null,
  profiles: [],
  account: null,
  userTokens: null,
  sides: [],
};

export const fetchUserDatas = createAsyncThunk(
  "userData/fetchUserTokensAndNfts",
  async (address: string) => {}
);

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    connect: (state: UserData, action: PayloadAction<any>) => {
      state.user = action.payload.user;
      state.account = action.payload.account;
    },
    disconnect: (state: UserData) => {
      state.user = null;
      state.account = null;
      state.userTokens = null;
    },
    updateUser: (state: UserData, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    addColony: (state: UserData, action: PayloadAction<any>) => {
      state.sides = [...state.sides, action.payload];
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchUserDatas.fulfilled, (state, action) => {});
  },
});

// Action creators are generated for each case reducer function
export const { connect, disconnect, updateUser, addColony } =
  userDataSlice.actions;

export default userDataSlice.reducer;
