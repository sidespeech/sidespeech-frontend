import React, { useEffect, useState } from "react";
import { Channel } from "../../../models/Colony";
import { Announcement } from "../../../models/Announcement";
import AnnouncementItem from "./AnnouncementItem";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/app.store";
import _ from "lodash";
import { apiService } from "../../../services/api.service";

export default function AnnouncementList() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [extend, setExtend] = useState<string>("");
  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);

  useEffect(() => {
    if (selectedChannel && selectedChannel.announcements) {
      setAnnouncements([
        ..._.orderBy(selectedChannel.announcements, "createdAt"),
      ]);
    }
  }, [selectedChannel]);

  useEffect(() => {
    async function getAnnouncements() {
      const response = await apiService.getAnnouncements();
      setAnnouncements(response);
    }
    getAnnouncements();
  });

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
  );
}
