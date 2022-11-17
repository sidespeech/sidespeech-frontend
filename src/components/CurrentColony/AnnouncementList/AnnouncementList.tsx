import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Editor } from 'react-draft-wysiwyg';
import _ from "lodash";

import { Announcement } from "../../../models/Announcement";
import AnnouncementItem from "./AnnouncementItem";
import { RootState } from "../../../redux/store/app.store";
import { apiService } from "../../../services/api.service";
import MessageInput from "../../ui-components/MessageInput";
import websocketService from "../../../services/websocket.service";
import { subscribeToEvent, unSubscribeToEvent } from "../../../helpers/CustomEvent";
import { EventType } from "../../../constants/EventType";
import { getRandomId } from "../../../helpers/utilities";

import EmptyList from '../shared-components/EmptyList';
import { Poll } from "../../../models/Poll";

import { Role } from "../../../models/Profile";
import styled from "styled-components";



interface AnnouncementListProps {
  announcementId?: string; 
  setThread?: any;
  thread: any;
}

export default function AnnouncementList({ announcementId, setThread, thread }: AnnouncementListProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const { selectedChannel, currentSide } = useSelector(
    (state: RootState) => state.appDatas
  );
  const { account, currentProfile } = useSelector((state: RootState) => state.user);

  const ref = useRef<Editor>(null);

  const handleReceiveAnnouncement = useCallback(({ detail }: { detail: Announcement }) => {
    if (selectedChannel?.id === detail.channelId)
      setAnnouncements(prevState => [...prevState, detail]);
  }, [selectedChannel]);

  useEffect(() => {
    const announcementThread = announcements.filter((announ: any) => announ.id === announcementId)[0];
    setThread?.(announcementThread);
  }, [announcements, announcementId]);

  useEffect(() => {
    subscribeToEvent(EventType.RECEIVE_ANNOUNCEMENT, handleReceiveAnnouncement);
    return () => {
      unSubscribeToEvent(
        EventType.RECEIVE_ANNOUNCEMENT,
        handleReceiveAnnouncement
      );
    };
  }, [announcements, handleReceiveAnnouncement]);

  useEffect(() => {
    async function getChannelAnnouncements() {
      const announcements = selectedChannel ? await apiService.getChannelAnnouncements(
        selectedChannel.id || ''
      ) : [];
      setAnnouncements(announcements);
    }
    if (selectedChannel) getChannelAnnouncements();
  }, [announcementId, selectedChannel]);

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
      {announcements.length ? (
        <div
          id="announcement-list"
          className="w-100 overflow-auto f-column-reverse"
        >
          {thread ? (
            <AnnouncementItem
                  announcement={thread}
                  isThread
                />
          ) : _.orderBy(announcements, ["timestamp"], ["desc"]).map(
            (a: Announcement, i) => (
                <AnnouncementItem
                  announcement={a}
                  className={i !== 0 ? 'border-bottom' : ''}
                  key={a.id + getRandomId() + i}
                />
            )
          )}
        </div>
      ) : (
        <EmptyList selectedChannel={selectedChannel} />
      )}
      {(selectedChannel?.type !== 0 ||
        currentProfile && currentProfile.role === Role.Admin) && !thread && (
        <div className="w-100" style={{ padding: "1rem", marginTop: "auto" }}>
          <MessageInput
            id="sendmessage"
            imageUpload
            onSubmit={handleAnnouncement}
            placeholder={"Type your message here"}
            radius="10px"
            ref={ref}
            size={14}
            weight={600}
          />
        </div>
      )}
    </>
  );
}
