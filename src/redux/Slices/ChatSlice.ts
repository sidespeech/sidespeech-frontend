import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Colony, Channel } from "../../models/Colony";
import { Message, Room } from "../../models/Room";

export interface ChatDatas {
  rooms: Room[];
  selectedRoom: Room | null;
}

const initialState: ChatDatas = {
  rooms: [],
  selectedRoom: null,
};

export const chatDatasSlice = createSlice({
  name: "chatDatas",
  initialState,
  reducers: {
    setRooms: (state: ChatDatas, action: PayloadAction<any>) => {
      state.rooms = action.payload;
    },
    setSelectedRoom: (state: ChatDatas, action: PayloadAction<Room | null>) => {
      const room = action.payload;
      state.selectedRoom = room;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setRooms,
  setSelectedRoom,
} = chatDatasSlice.actions;

export default chatDatasSlice.reducer;
