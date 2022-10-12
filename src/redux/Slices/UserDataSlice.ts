import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { UserTokensData } from "../../models/UserTokensData";
import websocketService from "../../services/websocket.service";
import { Room } from "../../models/Room";
import { User } from "../../models/User";
import { Profile } from "../../models/Profile";
import { Side } from "../../models/Side";

export interface UserData {
  user: User | null;
  profiles: Profile[];
  account: string | null;
  userTokens: UserTokensData | null;
  sides: Side[];
  currentProfile: Profile | undefined;
}

const initialState: UserData = {
  user: null,
  profiles: [],
  account: null,
  userTokens: null,
  sides: [],
  currentProfile: undefined,
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
      state.sides = action.payload.user.profiles.map((p: Profile) => p.side);
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
    setCurrentProfile: (state: UserData, action: PayloadAction<Side>) => {
      const userprofiles = state.user?.profiles;
      if (state.user && userprofiles) {
        const profile = userprofiles.find(
          (p) => p.side.id === action.payload.id
        );
        state.currentProfile = profile;
        websocketService.login(profile);
      }
    },
    updateCurrentProfile: (state: UserData, action: PayloadAction<Profile>) => {
      state.currentProfile = action.payload;
    },
    addRoomToProfile: (state: UserData, action: PayloadAction<Room>) => {
      if (state.currentProfile) {
        const rooms = state.currentProfile.rooms;
        state.currentProfile.rooms = [...rooms, action.payload];
      }
    },
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchUserDatas.fulfilled, (state, action) => {});
  },
});

// Action creators are generated for each case reducer function
export const {
  connect,
  disconnect,
  updateUser,
  addColony,
  setCurrentProfile,
  updateCurrentProfile,
  addRoomToProfile,
} = userDataSlice.actions;

export default userDataSlice.reducer;
