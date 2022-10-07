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

export default function AnnouncementList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [extend, setExtend] = useState<string>("");
  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (selectedChannel && selectedChannel.announcements) {
      setAnnouncements([
        ..._.orderBy(selectedChannel.announcements, "createdAt"),
      ]);
    }
    console.log(selectedChannel);
  }, [selectedChannel]);

  useEffect(() => {
    async function getAnnouncements() {
      const response = await apiService.getAnnouncements();
      setAnnouncements(response);
    }
    getAnnouncements();
  }, []);

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
    const creatorAddress = "0xFa446636A9e57ab763C1C70F80ea3c7C3969F397";

    const newAnnouncement = await apiService.createAnnouncement(
      value,
      creatorAddress
    );
    setAnnouncements([...announcements, newAnnouncement]);
    websocketService.sendAnnouncement(newAnnouncement);
  };
  const setCommenttoannouncements = async (
    comment: any,
    announcementid: string
  ) => {
    const a = announcements.find(
      (announcement) => announcement.id === announcementid
    );
    a.comments.push(comment);
  };

  return (
    <>
      <div id="announcement-list" className="w-100 overflow-auto">
        {announcements.map((a: Announcement) => {
          return (
            <AnnouncementItem
              key={a.id}
              extend={extend}
              handleExtendComments={handleExtendComments}
              announcement={a}
            />
          );
        })}
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
