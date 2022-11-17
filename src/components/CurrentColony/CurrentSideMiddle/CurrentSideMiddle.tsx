import React from "react";
import { useSelector } from "react-redux";
import { ChannelType } from "../../../models/Channel";
import { RootState } from "../../../redux/store/app.store";
import Button from "../../ui-components/Button";
import AnnouncementList from "../AnnouncementList/AnnouncementList";
import ChatComponent from "../ChatComponent/ChatComponent";
import { useMiddleSide } from "../CurrentSide";
import PollsList from "../Polls/PollsList";
import ChannelView from "./ChannelView";

export default function CurrentSideMiddle() {
  const {
    selectedRoom,
    selectedChannel,
    announcementId,
    setThread,
    thread,
    setCreatePollModal,
  } = useMiddleSide();

  return (
    <div className="middle-container-center-colony f-column justify-start">
      {!selectedChannel && selectedRoom && (
        <ChatComponent room={selectedRoom} />
      )}
      {selectedChannel && <ChannelView />}
    </div>
  );
}
