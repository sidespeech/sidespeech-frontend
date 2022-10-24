import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { UserTokensData } from "../../models/UserTokensData";
import websocketService from "../../services/websocket.service";
import { Room } from "../../models/Room";
import { User } from "../../models/User";
import { Profile } from "../../models/Profile";
import { Side } from "../../models/Side";
import { Channel } from "../../models/Channel";
import nftsService from "../../services/nfts.service";
import { UserCollectionsData } from "../../models/interfaces/UserCollectionsData";

export interface UserData {
  user: User | null;
  profiles: Profile[];
  account: string | null;
  userTokens: UserTokensData | null;
  redirectTo: null;
  sides: Side[];
  currentProfile: Profile | undefined;
  userCollectionsData: UserCollectionsData;
}

const initialState: UserData = {
  user: null,
  profiles: [],
  account: null,
  userTokens: null,
  redirectTo: null,
  sides: [],
  currentProfile: undefined,
  userCollectionsData: {},
};

export const flattenChannels = (sides: any) => {
  return sides.reduce(function (flat: any, toFlatten: any) {
    return flat.concat(Array.isArray(toFlatten.channels) ? flattenChannels(toFlatten.channels) : toFlatten.id);
  }, []);
};

export const fetchUserDatas = createAsyncThunk(
  "userData/fetchUserTokensAndNfts",
  async (address: string) => {
    return await nftsService.getNftsOwnedByAddress(
      "0xC2500706B995CFC3eE4Bc3f83029705B7e4D1a74"
    );
  }
);

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    connect: (state: UserData, action: PayloadAction<any>) => {
      state.user = action.payload.user;
      state.account = action.payload.account;
      state.sides = action.payload.user.profiles ? action.payload.user.profiles.map((p: Profile) => p.side) : '';
      state.redirectTo = action.payload.redirectTo;
      let rooms = flattenChannels(state.sides);
      websocketService.login(state.user, rooms);
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
        // websocketService.login(state.user, profile);
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
    builder.addCase(fetchUserDatas.fulfilled, (state, action) => {
      const nfts = action.payload;
      const res: any = {};
      // Add user to the state array
      nfts.forEach((nft: any) => {
        const existingObject = res[nft["token_address"]];
        if (existingObject) {
          existingObject.nfts.push(nft);
        } else {
          res[nft["token_address"]] = {
            address: nft["token_address"],
            name: nft["name"],
            symbol: nft["symbol"],
            nfts: [nft],
          };
        }
      });
      state.userCollectionsData = res;
    });
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
