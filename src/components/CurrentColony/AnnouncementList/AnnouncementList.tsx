import React, { useEffect, useState } from "react";
import { Announcement, Channel } from "../../../models/Colony";
import AnnouncementItem from "./AnnouncementItem";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/app.store";
import _ from "lodash";

export default function AnnouncementList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [extend, setExtend] = useState<string>("");
  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);

  useEffect(() => {
    if (selectedChannel && selectedChannel.announcements) {
      setAnnouncements([..._.orderBy(selectedChannel.announcements, "createdAt")]);
    }
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

  return (
    <div id="announcement-list" className="w-100" style={{ overflow: "auto" }}>
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
  );
}
