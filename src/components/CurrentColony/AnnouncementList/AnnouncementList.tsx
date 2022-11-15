import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from 'styled-components';
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
import Icons from "../../ui-components/ChannelIcons";
import emptyScreenImg from '../../../assets/channel_empty_screen_shape.svg'
import { getRandomId } from "../../../helpers/utilities";

const EmptyListStyled = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  .empty-list_wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-image: url(${emptyScreenImg});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center bottom;
    padding: 0 8rem 10rem 8rem;
    & .empty-list_icon {
      display: block;
      background-color: var(--bg-secondary-light);
      padding: 1.2rem;
      border-radius: 10rem;
      & svg {
        transform: scale(1.4);
        & path {
          fill: var(--text-secondary);
        }
      }
    }
    & .empty-list_title {
      margin-bottom: .5rem;
    }
    & .empty-list_description {
      color: var(--text-secondary-dark);
    }
  }
`;

interface AnnouncementListProps {
  announcementId?: string; 
  setThread?: any;
  thread: Announcement | null;
}

export default function AnnouncementList({ announcementId, setThread, thread }: AnnouncementListProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const { selectedChannel, currentSide } = useSelector(
    (state: RootState) => state.appDatas
  );
  const { account } = useSelector((state: RootState) => state.user);

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

  const Icon = Icons[selectedChannel?.type || 0];

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
        <EmptyListStyled>
          <div className="empty-list_wrapper">
            <span className="empty-list_icon">
              <Icon />
            </span>
            <h2 className="empty-list_title">Welcome to {selectedChannel?.name}</h2>
            <p className="empty-list_description">This is the beginning of the channel!</p>
          </div>
        </EmptyListStyled>
      )}
      {(selectedChannel?.type !== 0 ||
        currentSide?.creatorAddress === account) && !thread && (
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
