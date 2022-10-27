import { format } from "date-fns";
import { Editor } from 'react-draft-wysiwyg';
import _ from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { EventType } from "../../../constants/EventType";
import {
  subscribeToEvent,
  unSubscribeToEvent,
} from "../../../helpers/CustomEvent";
// import { timestampToLocalString } from "../../../helpers/utilities";
import { Message, Room } from "../../../models/Room";
// import {
//   addMessageToRoom,
//   updateSelectedRoomMessages,
// } from "../../../redux/Slices/ChatSlice";
import { userDataSlice } from "../../../redux/Slices/UserDataSlice";
import { RootState } from "../../../redux/store/app.store";
import { apiService } from "../../../services/api.service";
import websocketService from "../../../services/websocket.service";
import MessageInput from "../../ui-components/MessageInput";
import UserBadge from "../../ui-components/UserBadge";
import MessageContent from "../../ui-components/MessageContent";

interface IChatComponentProps {
  room: Room;
}

export default function ChatComponent(props: IChatComponentProps) {
  const dispatch = useDispatch();

  const ref = useRef<Editor>(null);

  const userData = useSelector((state: RootState) => state.user);
  const { selectedRoom } = useSelector((state: RootState) => state.chatDatas);

  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = (value: string) => {
    websocketService.sendMessage(
      value,
      props.room.id,
      userData.account || "error"
    );
    setMessages([
      ...messages,
      new Message({
        content: value,
        timestamp: Date.now().toString(),
        sender: userData.account,
      }),
    ]);
  };

  const handleReceiveMessage = ({ detail }: { detail: Message }) => {
    setMessages([...messages, detail]);
  };

  useEffect(() => {
    async function getRoomMessages() {
      const messages = await apiService.getRoomMessages(selectedRoom?.id || '');
      setMessages(messages);
    }
    if (selectedRoom) getRoomMessages();
  }, [selectedRoom]);

  useEffect(() => {
    subscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
    return () => {
      unSubscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
    };
  }, [messages]);

  return (
    <>
      <div className="text-primary-light overflow-auto w-100 px-3 f-column-reverse">
        {_.orderBy(messages, ["timestamp"], ["desc"]).map((m: Message) => {
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
              <MessageContent
                message={m.content}
              />
            </div>
          );
        })}
      </div>
      <div className="w-100" style={{ padding: "11px", marginTop: "auto" }}>
        <MessageInput
          height={55}
          imageUpload
          onSubmit={handleSendMessage}
          placeholder={""}
          radius="10px"
          ref={ref}
          size={14}
          weight={600}
        />
      </div>
    </>
  );
}
