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



export default function SideUserList({
  dots,
  handleSelectedUser,
  selectedUser
}: {
  dots: any;
  handleSelectedUser:any;
  selectedUser:any;
}) {
  const { currentSide } = useSelector((state: RootState) => state.appDatas);
  const { currentProfile } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
  }, [currentProfile, currentSide]);


  return (
    <>
      {currentSide?.profiles.map((p: Profile, index:number) => {
        const isMe = p.id === currentProfile?.id;
        const room = currentProfile?.getRoom(p.id);
        return (
          <div key={index}
            onClick={() => handleSelectedUser(p, currentProfile)}
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
