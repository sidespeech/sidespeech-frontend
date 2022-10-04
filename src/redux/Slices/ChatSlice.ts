import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Colony, Channel } from "../../models/Colony";
import { Room } from "../../models/Room";

export interface ChatDatas {
  rooms: Room[];
}

const initialState: ChatDatas = {
  rooms: [],
};

export const chatDatasSlice = createSlice({
  name: "chatDatas",
  initialState,
  reducers: {
    setRooms: (state: ChatDatas, action: PayloadAction<any>) => {
      state.rooms = action.payload;
    },
    addMessageToRoom: (state: ChatDatas, action: PayloadAction<any>) => {
      const { newMessage, roomId } = action.payload;
      const room = state.rooms.find((r) => r.id === roomId);
      if (room) room.messages = [...room.messages, newMessage];
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRooms, addMessageToRoom } = chatDatasSlice.actions;

export default chatDatasSlice.reducer;
