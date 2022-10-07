import { format } from "date-fns";
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EventType } from "../../../constants/EventType";
import { timestampToLocalString } from "../../../helpers/utilities";
import { Message, Room } from "../../../models/Room";
import {
  addMessageToRoom,
  updateSelectedRoomMessages,
} from "../../../redux/Slices/ChatSlice";
import { userDataSlice } from "../../../redux/Slices/UserDataSlice";
import { RootState } from "../../../redux/store/app.store";
import websocketService from "../../../services/websocket.service";
import InputText from "../../ui-components/InputText";
import UserBadge from "../../ui-components/UserBadge";

interface IChatComponentProps {
  room: Room;
}

export default function ChatComponent(props: IChatComponentProps) {
  const ref = useRef<HTMLInputElement>();
  const dispatch = useDispatch();

  const userData = useSelector((state: RootState) => state.user);

  const handleSendMessage = (value: string) => {
    websocketService.sendMessage(
      value,
      props.room.id,
      userData.account || "error"
    );
    dispatch(
      updateSelectedRoomMessages(
        new Message({
          content: value,
          timestamp: Date.now().toString(),
          sender: "me",
        })
      )
    );
    if (ref.current) ref.current.value = "";
  };
  return (
    <>
      <div className="text-primary-light overflow-auto w-100 px-3">
        {_.orderBy(props.room.messages, ["timestamp"], ["desc"]).map(
          (m: Message) => {
            return (
              <div className="annoucement-item">
                <div className="flex justify-between w-100">
                  <UserBadge weight={700} fontSize={14} username={m.sender} />
                  <div
                    className="size-11 fw-500 open-sans"
                    style={{ color: "#7F8CA4" }}
                  >
                    {format(m.timestamp * 1, "yyyy-mm-dd hh:mm")}
                  </div>
                </div>
                <div>{m.content}</div>
              </div>
            );
          }
        )}
      </div>
      <div className="w-100" style={{ padding: "11px", marginTop: "auto" }}>
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
    </>
  );
}
