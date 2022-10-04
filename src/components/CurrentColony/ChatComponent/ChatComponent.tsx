import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { EventType } from "../../../constants/EventType";
import { timestampToLocalString } from "../../../helpers/utilities";
import { Room } from "../../../models/Room";
import { addMessageToRoom } from "../../../redux/Slices/ChatSlice";
import { userDataSlice } from "../../../redux/Slices/UserDataSlice";
import websocketService from "../../../services/websocket.service";
import InputText from "../../ui-components/InputText";

interface IChatComponentProps {
  room: Room;
}

export default function ChatComponent(props: IChatComponentProps) {
  const ref = useRef<HTMLInputElement>();
  const dispatch = useDispatch();

  const handleSendMessage = (value: string) => {
    websocketService.sendMessage(value, props.room.id, "nicolas");
    dispatch(
      addMessageToRoom({
        roomId: props.room.id,
        newMessage: { content: value, timestamp: Date.now().toString() },
      })
    );
    if (ref.current) ref.current.value = "";
  };
  return (
    <div className="f-column justify-between">
      <div className="text-primary-light">{props.room.name}</div>
      <div className="text-primary-light">
        {props.room.messages.map((m: any) => {
          return (
            <div>
              {m.content}
              {timestampToLocalString(m.timestamp)}
            </div>
          );
        })}
      </div>
      <div>
        <InputText
          ref={ref}
          size={14}
          weight={600}
          glass={false}
          message
          iconRightPos={{ top: 19, right: 18 }}
          height={55}
          radius="10px"
          placeholder={""}
          onKeyUp={(event: any) => {
            if (event.key === "Enter") handleSendMessage(event.target.value);
          }}
          onClick={(e: any) => {
            handleSendMessage(e.target.value);
          }}
        />
      </div>
    </div>
  );
}
