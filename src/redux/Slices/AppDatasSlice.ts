import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Side } from "../../models/Side";
import { Channel } from "../../models/Channel";

export interface AppDatas {
  currentSide: Side | null;
  selectedChannel: Channel | null;
}

const initialState: AppDatas = {
  currentSide: null,
  selectedChannel: null,
};

export const appDatasSlice = createSlice({
  name: "appDatas",
  initialState,
  reducers: {
    setCurrentColony: (state: AppDatas, action: PayloadAction<Side>) => {
      state.currentSide = action.payload;
    },
    setSelectedChannel: (
      state: AppDatas,
      action: PayloadAction<Channel | null>
    ) => {
      state.selectedChannel = action.payload;
    },
    updateChannel: (state: AppDatas, action: PayloadAction<Channel>) => {
      if (state.currentSide) {
        const c = state.currentSide?.channels.findIndex(
          (c: any) => c.id === action.payload.id
        );
        if (c !== -1) state.currentSide?.channels.splice(c, 1, action.payload);
      }
    },
    addChannel: (state: AppDatas, action: PayloadAction<Channel>) => {
      if (state.currentSide) {
        state.currentSide.channels = [
          ...state.currentSide.channels,
          action.payload,
        ];
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentColony, setSelectedChannel, updateChannel, addChannel } =
  appDatasSlice.actions;

export default appDatasSlice.reducer;
