import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { EventType } from "../../../../constants/EventType";
import {
  subscribeToEvent,
  unSubscribeToEvent,
} from "../../../../helpers/CustomEvent";
import { Announcement } from "../../../../models/Announcement";
import { Channel } from "../../../../models/Channel";
import { setSelectedChannel } from "../../../../redux/Slices/AppDatasSlice";
import { setSelectedRoom } from "../../../../redux/Slices/ChatSlice";
import { RootState } from "../../../../redux/store/app.store";
import { apiService } from "../../../../services/api.service";
import { Dot } from "../../../ui-components/styled-components/shared-styled-components";

export default function ChannelsList({ channels }: { channels: Channel[] }) {
  const dispatch = useDispatch();

  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);

  const [dots_channel, setDots] = useState<any>({});

  const onChannelSelected = (c: Channel) => {
    dispatch(setSelectedChannel(c));
    dispatch(setSelectedRoom(null));
  };

  const handleReceiveAnnouncement = ({ detail }: { detail: Announcement }) => {
    const account = localStorage.getItem('userAccount')

    async function removeNotification() {
      await apiService.deleteNotification(selectedChannel!.id, account!);
    }

    if (
      !selectedChannel ||
      (selectedChannel && selectedChannel.id !== detail.channelId)
    ) {
      let dots_object:any = {...dots_channel}
      if (selectedChannel) dots_object[selectedChannel.id] = 0
      if (detail.channelId in dots_object) dots_object[detail.channelId] += 1
      else dots_object[detail.channelId] = 1
      // let number = dots_object[detail.channelId] || 0;      
      setDots(dots_object);
    }
    else {
      removeNotification();
    }
  };

  useEffect(() => {
    subscribeToEvent(EventType.RECEIVE_ANNOUNCEMENT, handleReceiveAnnouncement);
    return () => {
      unSubscribeToEvent(
        EventType.RECEIVE_ANNOUNCEMENT,
        handleReceiveAnnouncement
      );
    };
  }, [selectedChannel]);


  useEffect(() => {
    const account = localStorage.getItem('userAccount')
    async function getChannelNotifications(account:string) {
      const notifications = await apiService.getNotification(account!);
      let dots_object:any = {}
      for (let notification of notifications) {
        if (notification['name'] in dots_object && notification['name'] !== selectedChannel!.id) dots_object[notification.name] += 1
        else if (notification['name'] === selectedChannel!.id) {
          dots_object[notification.name] = 0
          await apiService.deleteNotification(selectedChannel!.id, account!);
        }
        else dots_object[notification.name] = 1
      }
      setDots(dots_object);
    }
    if (selectedChannel && account) getChannelNotifications(account);
  }, [selectedChannel]);


  return (
    <div className="mt-2">
      {channels.map((c, index) => {
        return (
          <div
            onClick={() => onChannelSelected(c)}
            key={index}
            className={`w-100 flex align-center justify-between px-2 mt-1 pointer ${
              selectedChannel &&
              selectedChannel.id === c.id &&
              "selected-channel"
            }`}
          >
            <span className="fw-600 size-12 flex align-center px-1 py-1">
              {c.isVisible ? (
                <i className="fa-solid fa-hashtag mr-2"></i>
              ) : (
                <i className="fa-solid fa-lock mr-2"></i>
              )}

              {c.name}
            </span>
            {c && dots_channel[c.id] > 0 && <Dot>{dots_channel[c.id]}</Dot>}
          </div>
        );
      })}
    </div>
  );
}
