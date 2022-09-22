import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import moralisService from "../../service/moralis.service";
import { UserTokensData } from "../../models/UserTokensData";
import { Colony } from "../../models/Colony";

export interface UserData {
  user: any;
  profiles: any[];
  account: string | null;
  userTokens: UserTokensData | null;
  colonies: Colony[];
}

const initialState: UserData = {
  user: null,
  profiles: [],
  account: null,
  userTokens: null,
  colonies: [],
};


export const fetchUserDatas = createAsyncThunk(
  "userData/fetchUserTokensAndNfts",
  async (address: string) => {
    const nfts = await moralisService.getNftsOwnedByAddress("0xC2500706B995CFC3eE4Bc3f83029705B7e4D1a74");
    nfts.ERC20Tokens = await moralisService.getUserTokens(address);
    const colonies = await moralisService.getUserColonies(address);
    console.log(colonies);
    return { nfts, colonies };
  }
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
      state.colonies = [...state.colonies,action.payload];
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchUserDatas.fulfilled, (state, action) => {
      const { nfts, colonies } = action.payload;
      // Add user to the state array
      state.userTokens = nfts;
      state.colonies = colonies;
    });
  },
});

// Action creators are generated for each case reducer function
export const { connect, disconnect,updateUser,addColony } = userDataSlice.actions;

export default userDataSlice.reducer;
