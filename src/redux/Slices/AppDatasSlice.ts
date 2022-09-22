import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Colony, Channel } from "../../models/Colony";

export interface AppDatas {
  currentColony: Colony | null;
  selectedChannel: Channel | null;
}
 
const initialState: AppDatas = {
  currentColony: null,
  selectedChannel: null,
};

export const appDatasSlice = createSlice({
  name: "appDatas",
  initialState,
  reducers: {
    setCurrentColony: (state: AppDatas, action: PayloadAction<any>) => {
      state.currentColony = action.payload;
    },
    setSelectedChannel: (state: AppDatas, action: PayloadAction<any>) => {
      state.selectedChannel = action.payload;
    },
    updateChannel: (state: AppDatas, action: PayloadAction<Channel>) => {
      if (state.currentColony) {
        const c = state.currentColony?.channels.findIndex(
          (c: any) => c.id === action.payload.id
        );
        if (c !== -1)
          state.currentColony?.channels.splice(c, 1, action.payload);
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentColony, setSelectedChannel, updateChannel } =
  appDatasSlice.actions;

export default appDatasSlice.reducer;
