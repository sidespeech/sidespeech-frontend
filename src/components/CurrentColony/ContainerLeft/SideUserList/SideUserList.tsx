import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { EventType } from "../../../../constants/EventType";
import {
  subscribeToEvent,
  unSubscribeToEvent,
} from "../../../../helpers/CustomEvent";
import { Profile } from "../../../../models/Profile";
import { Room } from "../../../../models/Room";
import { setSelectedChannel } from "../../../../redux/Slices/AppDatasSlice";
import {
  addMessageToRoom,
  setSelectedRoom,
  updateSelectedRoomMessages,
} from "../../../../redux/Slices/ChatSlice";
import {
  addRoomToProfile,
  updateCurrentProfile,
} from "../../../../redux/Slices/UserDataSlice";
import { RootState } from "../../../../redux/store/app.store";
import { apiService } from "../../../../services/api.service";
import websocketService from "../../../../services/websocket.service";
import UserBadge from "../../../ui-components/UserBadge";

const Dot = styled.div`
  width: 15px;
  height: 15px;
  color: white;
  background-color: var(--text-red);
  weight: 700;
  font-size: 10px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0px 1px 2px 0px;
`;

export default function SideUserList() {
  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const { currentProfile } = useSelector((state: RootState) => state.user);
  const { selectedRoom } = useSelector((state: RootState) => state.chatDatas);
  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [dots, setDots] = useState<any>({});
  const [profilesToDisplay, setProfilesToDisplay] = useState<Profile[]>([]);

  const handleSelectedUser = async (profile: Profile) => {
    setSelectedUser(profile);
    const connectedAccount = localStorage.getItem("userAccount");
    let room = currentProfile?.getRoom(profile.id);
    if (!currentProfile || !connectedAccount) return;
    if (room) {
      dispatch(setSelectedRoom(room));
      dispatch(setSelectedChannel(null));
    } else {
      room = await apiService.createRoom(currentProfile.id, profile.id);
      websocketService.addRoomToUsers(room.id, [currentProfile.id, profile.id]);
      dispatch(addRoomToProfile(room));
    }
    dispatch(setSelectedRoom(room));
    dispatch(setSelectedChannel(null));
  };

  const handleReceiveMessage = async (m: any) => {
    const { detail } = m;
    console.log(detail, selectedRoom);
    console.log("handleReceiveMessage");
    if (currentProfile?.rooms.some((r) => r.id === detail.room.id)) {
      console.log("handleReceiveMessage 1");
      if (
        !selectedRoom ||
        (selectedRoom && detail.room.id !== selectedRoom.id)
      ) {
        let number = dots[detail.room.id];
        setDots({ ...dots, [detail.room.id]: ++number });
        dispatch(
          addMessageToRoom({ roomId: detail.room.id, newMessage: detail })
        );
      } else {
        dispatch(updateSelectedRoomMessages(detail));
      }
    } else if (currentProfile) {
      console.log("handleReceiveMessage 2");

      setDots({ ...dots, [detail.room.id]: 1 });
      const updatedProfile = await apiService.getProfileById(currentProfile.id);
      console.log(updatedProfile);
      dispatch(updateCurrentProfile(updatedProfile));
    }
  };

  useEffect(() => {
    let foo: any = {};
    currentProfile?.rooms.map((room: Room) => {
      foo[room.id] = 0;
      setDots({ ...foo });
    });
  }, [currentProfile]);

  useEffect(() => {
    subscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
    if (selectedRoom) {
      setDots({ ...dots, [selectedRoom.id]: 0 });
    }

    return () => {
      unSubscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
    };
  }, [dots, selectedRoom, currentProfile]);

  return (
    <>
      {currentSide?.profiles.map((p: Profile) => {
        const isMe = p.id === currentProfile?.id;
        if (isMe) return;
        return (
          <div
            onClick={() => handleSelectedUser(p)}
            className={`w-100 flex justify-between align-center px-1 py-1 ${
              selectedUser && selectedUser.id === p.id && "selected-channel"
            }`}
          >
            <UserBadge weight={400} fontSize={11} address={p.username} />
          </div>
        );
      })}
    </>
  );
}
