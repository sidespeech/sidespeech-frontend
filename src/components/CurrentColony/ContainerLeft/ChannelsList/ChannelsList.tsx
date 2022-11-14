// import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
// import { EventType } from "../../../../constants/EventType";
// import {
//   subscribeToEvent,
//   unSubscribeToEvent,
// } from "../../../../helpers/CustomEvent";
// import { Announcement } from "../../../../models/Announcement";
import { Channel, ChannelType } from "../../../../models/Channel";
// import { setSelectedChannel } from "../../../../redux/Slices/AppDatasSlice";
// import { setSelectedRoom } from "../../../../redux/Slices/ChatSlice";
import { RootState } from "../../../../redux/store/app.store";
// import { apiService } from "../../../../services/api.service";
import { Dot } from "../../../ui-components/styled-components/shared-styled-components";

const ChannelsListStyled = styled.div`
  svg {
    & > path {
      fill: #B4C1D2;
    }
  &.selected > path {
    fill: #705CE9;
  }
  }
`

export default function ChannelsList({ channels, dots, onChannelSelected }: { channels: Channel[];  dots:any; onChannelSelected:any }) {
  const dispatch = useDispatch();

  const { selectedChannel } = useSelector((state: RootState) => state.appDatas);

  const Icons = {
    [ChannelType.Announcement]: ({className}: {className?: string}) => (
      <svg className={className} width="14" height="12" viewBox="0 0 14 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.5 12L3.25 9H0.625L1 7.5H3.625L4.375 4.5H1.375L1.75 3H4.75L5.5 0H7L6.25 3H9.25L10 0H11.5L10.75 3H13.375L13 4.5H10.375L9.625 7.5H12.625L12.25 9H9.25L8.5 12H7L7.75 9H4.75L4 12H2.5ZM5.125 7.5H8.125L8.875 4.5H5.875L5.125 7.5Z" />
      </svg>
    ),
    [ChannelType.Poll]: ({className}: {className?: string}) => (
      <svg className={className} width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.25 13.75V11.5H7.25V4H5.75V6.25H0.5V0.25H5.75V2.5H10.25V0.25H15.5V6.25H10.25V4H8.75V10H10.25V7.75H15.5V13.75H10.25Z" />
      </svg>
    ),
    [ChannelType.Textual]: ({className}: {className?: string}) => (
      <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.5 11.75V1.25C0.5 1.0375 0.572 0.85925 0.716 0.71525C0.8595 0.57175 1.0375 0.5 1.25 0.5H11C11.2125 0.5 11.3905 0.57175 11.534 0.71525C11.678 0.85925 11.75 1.0375 11.75 1.25V8C11.75 8.2125 11.678 8.3905 11.534 8.534C11.3905 8.678 11.2125 8.75 11 8.75H3.5L0.5 11.75ZM4.25 12.5C4.0375 12.5 3.85925 12.428 3.71525 12.284C3.57175 12.1405 3.5 11.9625 3.5 11.75V10.25H13.25V3.5H14.75C14.9625 3.5 15.1405 3.57175 15.284 3.71525C15.428 3.85925 15.5 4.0375 15.5 4.25V15.5L12.5 12.5H4.25Z" />
      </svg>
    )
  }

  return (
    <ChannelsListStyled className="pl-2 mt-3">
      {channels.map((c, index) => {
        const Icon = Icons[c.type];
        const isSelected = selectedChannel?.id === c.id;

        return (
          <div
            onClick={() => onChannelSelected(c)}
            key={index}
            className={`w-100 flex align-center justify-between px-2 py-2 pointer ${
              isSelected &&
              "selected-channel"
            }`}
          >
            <span className="fw-600 size-12 flex align-center px-1 py-1">
              {c.isVisible ? (<Icon className={`mr-2 ${isSelected ? 'selected' : ''}`} />) : (
                <i className="fa-solid fa-lock mr-2"></i>
              )}

              {c.name}
            </span>
            {c && dots[c.id ] > 0 && <Dot>{dots[c.id]}</Dot>}
          </div>
        );
      })}
    </ChannelsListStyled>
  );
}
