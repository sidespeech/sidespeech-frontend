import React from "react";
import { ChannelType } from "../../../models/Channel";
import AnnouncementList from "../AnnouncementList/AnnouncementList";
import ChatComponent from "../ChatComponent/ChatComponent";
import { useMiddleSide } from "../CurrentSide";
import PollsList from "../Polls/PollsList";

export default function ChannelView() {

    const {
        selectedRoom,
        selectedChannel,
        announcementId,
        setThread,
        thread,
        setCreatePollModal,
      } = useMiddleSide();

  return (
    <>
      {selectedChannel && (
        <>
          {selectedChannel.type === ChannelType.Announcement && (
            <AnnouncementList
              announcementId={announcementId}
              setThread={setThread}
              thread={thread}
            />
          )}
          {selectedChannel.type === ChannelType.Poll && (
            <PollsList
              pollId={announcementId}
              setCreatePollModal={setCreatePollModal}
              setThread={setThread}
              thread={thread}
            />
          )}
          {selectedChannel.type === ChannelType.Textual && selectedRoom && (
            <ChatComponent room={selectedRoom} />
          )}
        </>
      )}
    </>
  );
}
