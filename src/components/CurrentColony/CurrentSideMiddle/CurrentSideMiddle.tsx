import React from "react";
import { useSelector } from "react-redux";
import { ChannelType } from "../../../models/Channel";
import { RootState } from "../../../redux/store/app.store";
import Button from "../../ui-components/Button";
import AnnouncementList from "../AnnouncementList/AnnouncementList";
import ChatComponent from "../ChatComponent/ChatComponent";
import { useMiddleSide } from "../CurrentSide";
import Polls from "../Polls/Polls";

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
      {selectedRoom ? (
        <ChatComponent room={selectedRoom} />
      ) : (
        <>
          {selectedChannel && (
            <>
              {selectedChannel.type === ChannelType.Announcement ||
              selectedChannel.type === ChannelType.Textual ? (
                <>
                  <AnnouncementList
                    announcementId={announcementId}
                    setThread={setThread}
                    thread={thread}
                  />
                </>
              ) : (
                <>
                  <Polls />
                  <div
                    className="w-100"
                    style={{ padding: "11px", marginTop: "auto" }}
                  >
                    <Button
                      classes="mt-auto mx-auto mb-2"
                      onClick={() => setCreatePollModal(true)}
                    >
                      Create Poll
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
