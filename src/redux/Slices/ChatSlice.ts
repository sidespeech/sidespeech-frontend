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
    addMessageToRoom: (state: ChatDatas, action: PayloadAction<any>) => {
      const { newMessage, roomId } = action.payload;
      const room = state.rooms.find((r) => r.id === roomId);
      if (room) room.messages = [...room.messages, newMessage];
    },
    setSelectedRoom: (state: ChatDatas, action: PayloadAction<Room>) => {
      const room = action.payload;
      state.selectedRoom = room;
    },
    updateSelectedRoomMessages: (state: ChatDatas, action: PayloadAction<Message>) => {
      if(state.selectedRoom){
        state.selectedRoom.messages = [...state.selectedRoom.messages,action.payload]
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const { setRooms, addMessageToRoom, setSelectedRoom, updateSelectedRoomMessages } = chatDatasSlice.actions;

export default chatDatasSlice.reducer;