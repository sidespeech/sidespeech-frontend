import { createAsyncThunk, createSlice, current } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

import { UserTokensData } from "../../models/UserTokensData";
import websocketService from "../../services/websocket.service";
import { Room } from "../../models/Room";
import { User } from "../../models/User";
import { Profile } from "../../models/Profile";
import { Side } from "../../models/Side";
import { UserCollectionsData } from "../../models/interfaces/UserCollectionsData";
import { Collection } from "../../models/interfaces/collection";
import alchemyService from "../../services/alchemy.service";
import { sideAPI } from "../../services/side.service";
import { RootState } from "../store/app.store";
import { apiService } from "../../services/api.service";

export interface UserData {
  user: User | null;
  profiles: Profile[];
  account: string | null;
  userTokens: UserTokensData | null;
  redirectTo: null;
  sides: Side[];
  currentProfile: Profile | undefined;
  userCollectionsData: UserCollectionsData;
  userCollectionsLoading: boolean;
  userCollectionsLoadingSides: boolean;
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
  userCollectionsLoading: false,
  userCollectionsLoadingSides: false,
};

export const flattenChannels = (array: any, key: string) => {
  return array?.reduce(function (flat: any, toFlatten: any) {
    return flat.concat(
      Array.isArray(toFlatten[key])
        ? flattenChannels(toFlatten[key], key)
        : toFlatten.id
    );
  }, []);
};

export const fetchUserDatas = createAsyncThunk(
  "userData/fetchUserTokensAndNfts",
  async (address: string, { dispatch, getState }) => {
    const nfts = await alchemyService.getUserNfts(
      "0xC2500706B995CFC3eE4Bc3f83029705B7e4D1a74"
    );
    const collections = await alchemyService.getUserCollections(
      "0xC2500706B995CFC3eE4Bc3f83029705B7e4D1a74"
    );

    await apiService.savedCollections(collections);
    let res: any = {};
    for (let nft of nfts) {
      const address = nft["token_address"];
      const existingObject = res[address];
      if (existingObject) {
        existingObject.nfts.push(nft);
      } else {
        res[address] = collections.find(
          (c: Collection) => c.address === address
        );
        res[address].nfts.push(nft);
      }
    }
    dispatch(updateSidesByUserCollections(res));
    return res;
  }
);

export const updateSidesByUserCollections = createAsyncThunk(
  "userData/updateSidesByUserCollections",
  async (collections: Collection[] | null, { dispatch, getState }) => {
    const state: any = getState();
    const currentUserCollection = state.user.userCollectionsData;
    Object.values(collections || currentUserCollection).forEach((coll: any) => {
      dispatch(getSidesByCollection(coll?.address));
    });
  }
)

export const getSidesByCollection = createAsyncThunk(
  "userData/getSidesByCollection",
  async (address: string, { dispatch, getState }) => {
    const response = await sideAPI.getSidesByCollections([address]);
    return response;
  }
);

export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    connect: (state: UserData, action: PayloadAction<any>) => {
      state.user = action.payload.user;
      state.account = action.payload.account;
      let rooms = flattenChannels(state.user?.profiles, "rooms");
      state.sides = action.payload.user.profiles
        ? action.payload.user.profiles.map((p: Profile) => {
            p.side["profiles"] = [p];
            return p.side;
          })
        : [];
      state.redirectTo = action.payload.redirectTo;
      rooms = rooms?.concat(flattenChannels(state.sides, "channels"));
      websocketService.login(state.user, rooms);
    },
    disconnect: (state: UserData) => {
      state.user = null;
      state.account = null;
      state.userTokens = null;
    },
    updateUser: (state: UserData, action: PayloadAction<any>) => {
      state.user = { ...state.user, ...action.payload };
    },
    updateProfiles: (state: UserData, action: PayloadAction<any>) => {
      if (state.user) {
        const profiles = [...state.user?.profiles, action.payload];
        state.user = { ...state.user, profiles: profiles };
      }
    },
    addColony: (state: UserData, action: PayloadAction<any>) => {
      state.sides = [...state.sides, action.payload];
    },
    setCurrentProfile: (state: UserData, action: PayloadAction<Side>) => {
      const userprofiles = state.user?.profiles;
      if (state.user && userprofiles) {
        const profile = userprofiles.find((p) => {
          return p.side.id === action.payload.id;
        });
        state.currentProfile = profile;
        // websocketService.login(state.user, profile);
      }
    },
    updateCurrentProfile: (state: UserData, action: PayloadAction<Profile>) => {
      state.currentProfile = action.payload;
      if (state.user) {
        const user = { ...state.user };
        const profiles = [...user.profiles];
        const index = profiles.findIndex(
          (p: Profile) => p.id === action.payload.id
        );
        if (index !== -1) {
          profiles.splice(index, 1, action.payload);
          user.profiles = profiles;
          state.user = {...user};
        }
      }
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
    builder.addCase(fetchUserDatas.pending, (state, action) => {
      state.userCollectionsLoading = true;
    });
    builder.addCase(fetchUserDatas.rejected, (state, action) => {
      state.userCollectionsLoading = false;
    });
    builder.addCase(fetchUserDatas.fulfilled, (state, action) => {
      state.userCollectionsData = { ...action.payload };
      state.userCollectionsLoading = false;
    });
    builder.addCase(getSidesByCollection.pending, (state, action) => {
      state.userCollectionsLoadingSides = true;
    });
    builder.addCase(getSidesByCollection.rejected, (state, action) => {
      state.userCollectionsLoadingSides = false;
    });
    builder.addCase(getSidesByCollection.fulfilled, (state, action) => {
      state.userCollectionsData[action.payload.contracts].sideCount =
        action.payload.count;
      state.userCollectionsLoadingSides = false;
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
  updateProfiles,
} = userDataSlice.actions;

export default userDataSlice.reducer;
