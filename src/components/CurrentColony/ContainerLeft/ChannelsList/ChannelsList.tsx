// import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import _ from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
// import { EventType } from "../../../../constants/EventType";
// import {
//   subscribeToEvent,
//   unSubscribeToEvent,
// } from "../../../../helpers/CustomEvent";
// import { Announcement } from "../../../../models/Announcement";
import { Channel, ChannelType } from '../../../../models/Channel';
// import { setSelectedChannel } from "../../../../redux/Slices/AppDatasSlice";
// import { setSelectedRoom } from "../../../../redux/Slices/ChatSlice";
import { RootState } from '../../../../redux/store/app.store';
import { Dot } from '../../../ui-components/styled-components/shared-styled-components';
import Icons from '../../../ui-components/ChannelIcons';

const ChannelsListStyled = styled.div`
    svg {
        & > path {
            fill: var(--text);
        }
        &.selected > path {
            fill: var(--primary);
        }
    }
`;

interface ChannelsListProps {
    channels: Channel[];
    dots: any;
    onChannelSelected: any;
}

export default function ChannelsList({ channels, dots, onChannelSelected }: ChannelsListProps) {
    const dispatch = useDispatch();

    const { selectedChannel } = useSelector((state: RootState) => state.appDatas);

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
                            isSelected && 'selected-channel'
                        }`}
                    >
                        <span className="fw-600 size-12 flex align-center px-1 py-1">
                            {c.isVisible ? (
                                <Icon className={`mr-2 ${isSelected ? 'selected' : ''}`} />
                            ) : (
                                <i className="fa-solid fa-lock mr-2"></i>
                            )}

                            {c.name}
                        </span>
                        {c && dots[c.id] > 0 && <Dot>{dots[c.id]}</Dot>}
                    </div>
                );
            })}
        </ChannelsListStyled>
    );
}
