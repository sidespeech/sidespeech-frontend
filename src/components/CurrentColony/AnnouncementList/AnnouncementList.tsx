import React, { useEffect, useState } from "react";
import { Channel } from "../../../models/Colony";
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
  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);
  const { account } = useSelector((state: RootState) => state.user);
  const [inputValue, setInputValue] = useState("");

  const handleReceiveAnnouncement = ({ detail }: { detail: Announcement }) => {
    if (selectedChannel?.id === detail.channel.id)
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
    if (selectedChannel && selectedChannel?.announcements)
      setAnnouncements(selectedChannel?.announcements);
  }, [selectedChannel]);

  useEffect(() => {
    function updateScroll() {
      var element = document.getElementById("announcement-list");
      if (element) element.scrollTop = element.scrollHeight;
    }
    updateScroll();
  }, [announcements]);

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
  };

  return (
    <>
      <div id="announcement-list" className="w-100 overflow-auto">
        {_.orderBy(announcements, ["timestamp"], ["desc"]).map(
          (a: Announcement) => {
            return (
              <AnnouncementItem
                key={a.id}
                extend={extend}
                handleExtendComments={handleExtendComments}
                announcement={a}
              />
            );
          }
        )}
      </div>
      <div className="w-100" style={{ padding: "11px", marginTop: "auto" }}>
        <InputText
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
    </>
  );
}
