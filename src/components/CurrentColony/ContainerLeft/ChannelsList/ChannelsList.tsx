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

export default function ChannelsList({ channels, dots, onChannelSelected }: { channels: Channel[];  dots:any; onChannelSelected:any }) {
  const dispatch = useDispatch();

  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);

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
            {c && dots[c.id] > 0 && <Dot>{dots[c.id]}</Dot>}
          </div>
        );
      })}
    </div>
  );
}
