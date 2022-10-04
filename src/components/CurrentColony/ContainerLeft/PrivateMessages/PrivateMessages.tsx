import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { EventType } from "../../../../constants/EventType";
import {
  subscribeToEvent,
  unSubscribeToEvent,
} from "../../../../helpers/CustomEvent";
import { Room } from "../../../../models/Room";
import {
  addMessageToRoom,
  setSelectedRoom,
  updateSelectedRoomMessages,
} from "../../../../redux/Slices/ChatSlice";
import { RootState } from "../../../../redux/store/app.store";
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

export default function PrivateMessages() {
  const dispatch = useDispatch();
  const { rooms, selectedRoom } = useSelector(
    (state: RootState) => state.chatDatas
  );
  const [dots, setDots] = useState<any>({});

  const handleSelectedRoom = (room: any) => {
    dispatch(setSelectedRoom(room));
  };
  const handleReceiveMessage = (m: any) => {
    const { detail } = m;
    if (!selectedRoom || (selectedRoom && detail.room.id !== selectedRoom.id)) {
      let number = dots[detail.room.id];
      setDots({ ...dots, [detail.room.id]: ++number });
      dispatch(
        addMessageToRoom({ roomId: detail.room.id, newMessage: detail })
      );
    } else {
      dispatch(updateSelectedRoomMessages(detail));
    }
  };

  useEffect(() => {
    let foo: any = {};
    rooms.map((room: Room) => {
      foo[room.id] = 0;
      setDots({ ...foo });
    });
  }, []);

  useEffect(() => {
    subscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);

    return () => {
      unSubscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
    };
  }, [dots, selectedRoom]);

  return (
    <>
      {rooms &&
        rooms.map((room: any) => {
          return (
            <div
              onClick={() => handleSelectedRoom(room)}
              className="w-100 flex justify-between align-center"
            >
              <UserBadge
                connect
                weight={400}
                fontSize={11}
                username={room.name}
              />
              {dots[room.id] > 0 && <Dot>{dots[room.id]}</Dot>}
            </div>
          );
        })}
    </>
  );
}
