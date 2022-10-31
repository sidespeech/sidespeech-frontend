import React, { useEffect, useRef, useState } from "react";
import { Editor } from 'react-draft-wysiwyg';
import { Announcement } from "../../../models/Announcement";
import AnnouncementItem from "./AnnouncementItem";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/app.store";
import _ from "lodash";
import { apiService } from "../../../services/api.service";
import MessageInput from "../../ui-components/MessageInput";
import websocketService from "../../../services/websocket.service";
import {
  subscribeToEvent,
  unSubscribeToEvent,
} from "../../../helpers/CustomEvent";
import { EventType } from "../../../constants/EventType";

export default function AnnouncementList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [extend, setExtend] = useState<string>("");
  const { selectedChannel, currentSide } = useSelector(
    (state: RootState) => state.appDatas
  );
  const { account } = useSelector((state: RootState) => state.user);

  const ref = useRef<Editor>(null);

  const handleReceiveAnnouncement = ({ detail }: { detail: Announcement }) => {
    if (selectedChannel?.id === detail.channelId)
      setAnnouncements([...announcements, detail]);
  };

  useEffect(() => {
    subscribeToEvent(EventType.RECEIVE_ANNOUNCEMENT, handleReceiveAnnouncement);
    return () => {
      unSubscribeToEvent(
        EventType.RECEIVE_ANNOUNCEMENT,
        handleReceiveAnnouncement
      );
    };
  }, [announcements]);

  useEffect(() => {
    async function getChannelAnnouncements() {
      const announcements = selectedChannel ? await apiService.getChannelAnnouncements(
        selectedChannel.id || ''
      ) : [];
      setAnnouncements(announcements);
    }
    if (selectedChannel) getChannelAnnouncements();
  }, [selectedChannel]);

  const handleExtendComments = (id: string) => {
    setExtend(id === extend ? "" : id);
  };

  const handleAnnouncement = async (value: string) => {
    // This will need to be made dynamic.
    const creatorAddress = account;
    if (!selectedChannel) return;
    const newAnnouncement = await apiService.createAnnouncement(
      value,
      creatorAddress,
      selectedChannel.id || ''
    );
    setAnnouncements([...announcements, newAnnouncement]);
    websocketService.sendAnnouncement(newAnnouncement);
  };

  return (
    <>
      <div
        id="announcement-list"
        className="w-100 overflow-auto f-column-reverse"
      >
        {_.orderBy(announcements, ["timestamp"], ["desc"]).map(
          (a: Announcement, i) => {
            return (
              <div key={i}>
                {" "}
                <AnnouncementItem
                  key={a.id}
                  extend={extend}
                  handleExtendComments={handleExtendComments}
                  announcement={a}
                />{" "}
              </div>
            );
          }
        )}
      </div>
      {(selectedChannel?.type !== 0 ||
        currentSide?.creatorAddress === account) && (
        <div className="w-100" style={{ padding: "11px", marginTop: "auto" }}>
          <MessageInput
            id="sendmessage"
            imageUpload
            onSubmit={handleAnnouncement}
            placeholder={"Type your message here"}
            radius="10px"
            ref={ref}
            size={14}
            toolbar
            weight={600}
          />
        </div>
      )}
    </>
  );
}
