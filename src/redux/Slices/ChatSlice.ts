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
      console.log("setRooms");
      state.rooms = action.payload;
    },
    addMessageToRoom: (state: ChatDatas, action: PayloadAction<any>) => {
      console.log("addMessageToRoom");
      const { newMessage, roomId } = action.payload;
      const room = state.rooms.find((r) => r.id === roomId);
      if (room) room.messages = [...room.messages, newMessage];
      else state.rooms = [...state.rooms, newMessage.room];
    },
    setSelectedRoom: (state: ChatDatas, action: PayloadAction<Room | null>) => {
      console.log("setSelectedRoom");
      const room = action.payload;
      state.selectedRoom = room;
    },
    updateSelectedRoomMessages: (
      state: ChatDatas,
      action: PayloadAction<Message>
    ) => {
      console.log("updateSelectedRoomMessages");

      if (state.selectedRoom) {
        const room = state.selectedRoom;
        room.messages.push(action.payload);
        state.selectedRoom = null;
        state.selectedRoom = room;
      }
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setRooms,
  addMessageToRoom,
  setSelectedRoom,
  updateSelectedRoomMessages,
} = chatDatasSlice.actions;

export default chatDatasSlice.reducer;
