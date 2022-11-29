import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import styled from 'styled-components';
import { toast } from 'react-toastify';
import { formatDistance } from 'date-fns';

import { Announcement } from '../../../models/Announcement';
import { Comment } from '../../../models/Comment';
import UserBadge from '../../ui-components/UserBadge';
import { RootState } from '../../../redux/store/app.store';
import { ChannelType } from '../../../models/Channel';
import MessageContent from '../../ui-components/MessageContent';
import Comments from '../shared-components/Comments';
import { fixURL, getRandomId, reduceWalletAddressForColor } from '../../../helpers/utilities';
import Accordion from '../../ui-components/Accordion';
import { useNavigate, useParams } from 'react-router-dom';
import { subscribeToEvent, unSubscribeToEvent } from '../../../helpers/CustomEvent';
import { EventType } from '../../../constants/EventType';
import websocketService from '../../../services/websocket-services/websocket.service';
import commentService from '../../../services/api-services/comment.service';

const AnnouncementItemStyled = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: fit-content;
    padding: 1rem 1rem 0 1rem;
    gap: 0.5rem;
    color: var(--text);
    &.thread {
        max-height: 100%;
        overflow-y: scroll;
        padding-bottom: 4rem;
    }
    &.border-bottom {
        border-bottom: 1px solid var(--disable);
    }
`;

interface AnnouncementItemProps {
    announcement: Announcement;
    authorizeComments?: boolean;
    className?: string;
    isThread?: boolean;
}

export default function AnnouncementItem({
    announcement,
    authorizeComments,
    className,
    isThread
}: AnnouncementItemProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const { id } = useParams();

    const { selectedChannel, currentSide } = useSelector((state: RootState) => state.appDatas);
    const { account } = useSelector((state: RootState) => state.user);
    const [data, setData] = useState<any>({ profile: null, url: '' });

    // This will handle sending an comment to the api.
    const handleComment = async (value: string) => {
        // This will need to be made dynamic.
        const creatorAddress = account;
        try {
            const newComment = await commentService.sendComment(value, creatorAddress, announcement.id);
            setComments([...comments, newComment]);
            websocketService.sendComment(newComment);
        } catch (error) {
            console.error(error);
            toast.error('There has been an error when commenting this announcement', {
                toastId: getRandomId()
            });
        }
    };

    const handleReceiveComment = useCallback(
        ({ detail }: { detail: any }) => {
            setComments([...detail['announcement']['comments'], detail]);
        },
        // eslint-disable-next-line
        [selectedChannel]
    );

    useEffect(() => {
        subscribeToEvent(EventType.RECEIVE_COMMENT, handleReceiveComment);
        return () => {
            unSubscribeToEvent(EventType.RECEIVE_COMMENT, handleReceiveComment);
        };
    }, [comments, handleReceiveComment]);

    useEffect(() => {
        const profile = currentSide?.profiles.find(
            (p) => p.user.accounts.toLowerCase() === announcement.creatorAddress.toLowerCase()
        );
        if (profile) {
            const url = profile?.profilePicture?.metadata?.image ? fixURL(profile.profilePicture?.metadata?.image) : '';
            setData({ profile: profile, url: url });
        }
    }, [announcement.creatorAddress, currentSide]);

    return (
        <AnnouncementItemStyled className={`${className || ''}`}>
            <div className="flex w-100 gap-20">
                <UserBadge
                    check
                    color={reduceWalletAddressForColor(announcement.creatorAddress)}
                    weight={700}
                    fontSize={14}
                    avatar={data.url}
                    username={data.profile?.user.username}
                />
                <div className="size-11 fw-500 open-sans" style={{ color: 'var(--inactive)' }}>
                    {formatDistance(new Date(Number.parseInt(announcement.timestamp)), new Date(), {
                        addSuffix: true
                    })}
                </div>
            </div>

            <MessageContent message={announcement.content} />

            {authorizeComments && selectedChannel && selectedChannel.type === ChannelType.Announcement && (
                <Comments
                    channel={announcement}
                    comments={comments}
                    isThread={!!isThread}
                    handleComment={handleComment}
                    sideId={id || ''}
                />
            )}
        </AnnouncementItemStyled>
    );
}
