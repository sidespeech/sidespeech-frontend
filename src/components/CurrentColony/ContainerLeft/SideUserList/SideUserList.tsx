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
import { setSelectedRoom } from "../../../../redux/Slices/ChatSlice";
import {
  addRoomToProfile,
  updateCurrentProfile,
} from "../../../../redux/Slices/UserDataSlice";
import { RootState } from "../../../../redux/store/app.store";
import { apiService } from "../../../../services/api.service";
import websocketService from "../../../../services/websocket.service";
import { Dot } from "../../../ui-components/styled-components/shared-styled-components";
import UserBadge from "../../../ui-components/UserBadge";



export default function SideUserList() {
  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const { currentProfile } = useSelector((state: RootState) => state.user);
  const { selectedRoom } = useSelector((state: RootState) => state.chatDatas);
  const dispatch = useDispatch();

  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [dots, setDots] = useState<any>({});

  const handleSelectedUser = async (profile: Profile) => {
    // set selected user
    setSelectedUser(profile);
    // getting account
    const connectedAccount = localStorage.getItem("userAccount");
    // getting room for given profile id
    let room = currentProfile?.getRoom(profile.id);
    if (!currentProfile || !connectedAccount) return;
    // if room not exist in profile
    if (!room) {
      // creating the room
      room = await apiService.createRoom(currentProfile.id, profile.id);
      // add this room in the user websocket
      websocketService.addRoomToUsers(room.id, [currentProfile.id, profile.id]);
      // add the room to profile
      dispatch(addRoomToProfile(room));
    }
    // selecting the room
    dispatch(setSelectedRoom(room));
    dispatch(setSelectedChannel(null));
  };

  const handleReceiveMessage = async (m: any) => {
    console.log('m :', m);
    const { detail } = m;
    console.log('detail :', detail);
    // looking if the profile has already the room
    if (currentProfile?.rooms.some((r) => r.id === detail.room.id)) {
      //if yes, looking if the message comes from the selected room
      if (
        !selectedRoom ||
        (selectedRoom && detail.room.id !== selectedRoom.id)
      ) {
        // if not incrementing the notification dot
        let number = dots[detail.room.id] || 0;
        setDots({ ...dots, [detail.room.id]: ++number });
      }
    } else if (currentProfile) {
      // if not, getting the updated profile from backend
      const updatedProfile = await apiService.getProfileById(currentProfile.id);
      // updating the profile in the store
      dispatch(updateCurrentProfile(updatedProfile));
      // initializing notification for this room at 1
      setDots({ ...dots, [detail.room.id]: 1 });
    }
  };

  useEffect(() => {
    console.log('useEffect')
    subscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
    // if (selectedRoom && dots[selectedRoom.id] > 0)
    //   setDots({ ...dots, [selectedRoom.id]: 0 });
    return () => {
      unSubscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
    };
  }, [currentProfile]);


  return (
    <>
      {currentSide?.profiles.map((p: Profile, index:number) => {
        const isMe = p.id === currentProfile?.id;
        const room = currentProfile?.getRoom(p.id);
        return (
          <div key={index}
            onClick={() => handleSelectedUser(p)}
            className={`w-100 flex justify-between align-center px-1 py-1 ${
              selectedUser && selectedUser.id === p.id && "selected-channel"
            }`}
          >
            <UserBadge weight={400} fontSize={11} address={p.username} />
            {room && !isMe && dots[room.id] > 0 && <Dot>{dots[room.id]}</Dot>}
            {isMe && "(you)"}
          </div>
        );
      })}
    </>
  );
}
