import React, { useEffect, useRef, useState } from "react";
import { Announcement } from "../../../models/Announcement";
import AnnouncementItem from "./AnnouncementItem";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/app.store";
import _ from "lodash";
import { apiService } from "../../../services/api.service";
import InputText from "../../ui-components/InputText";
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
  const [inputValue, setInputValue] = useState("");

  const ref = useRef<HTMLInputElement>();

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
      const announcements = await apiService.getChannelAnnouncements(
        selectedChannel.id
      );
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
      selectedChannel.id
    );
    setAnnouncements([...announcements, newAnnouncement]);
    websocketService.sendAnnouncement(newAnnouncement);
    if (ref.current) ref.current.value = "";
  };

  return (
    <>
      <div
        id="announcement-list"
        className="w-100 overflow-auto f-column-reverse"
      >
        {_.orderBy(announcements, ["timestamp"], ["desc"]).map(
          (a: Announcement) => {
            return (
              <>
                {" "}
                <AnnouncementItem
                  key={a.id}
                  extend={extend}
                  handleExtendComments={handleExtendComments}
                  announcement={a}
                />{" "}
              </>
            );
          }
        )}
      </div>
      {(selectedChannel?.type !== 0 ||
        currentSide?.creatorAddress === account) && (
        <div className="w-100" style={{ padding: "11px", marginTop: "auto" }}>
          <InputText
            ref={ref}
            size={14}
            weight={600}
            glass={false}
            message
            id="sendmessage"
            iconRightPos={{ top: 19, right: 18 }}
            height={55}
            radius="10px"
            placeholder={"Type your message here"}
            onChange={(event: any) => {
              setInputValue(event.target.value);
            }}
            onKeyUp={(event: any) => {
              if (event.key === "Enter") handleAnnouncement(inputValue);
            }}
            onClick={(e: any) => {
              handleAnnouncement(inputValue);
            }}
          />
        </div>
      )}
    </>
  );
}
