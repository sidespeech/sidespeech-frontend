import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Editor } from 'react-draft-wysiwyg';
import _ from 'lodash';

import { Announcement } from '../../../models/Announcement';
import AnnouncementItem from './AnnouncementItem';
import { RootState } from '../../../redux/store/app.store';
import MessageInput from '../../ui-components/MessageInput';
import websocketService from '../../../services/websocket-services/websocket.service';
import { subscribeToEvent, unSubscribeToEvent } from '../../../helpers/CustomEvent';
import { EventType } from '../../../constants/EventType';
import { getRandomId } from '../../../helpers/utilities';

import EmptyList from '../shared-components/EmptyList';

import { Role } from '../../../models/Profile';
import styled from 'styled-components';
import { breakpoints, size } from '../../../helpers/breakpoints';
import channelService from '../../../services/api-services/channel.service';
import announcementService from '../../../services/api-services/announcement.service';
import Skeleton from '../../ui-components/Skeleton';

const AnnouncementListStyled = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	width: 100%;
	height: 100%;
	min-height: calc(100vh - 6rem - 77px);
	max-height: calc(100vh - 6rem - 77px);
	${breakpoints(
		size.lg,
		`{
            max-height: calc(100vh - 4rem);
        }`
	)}
	padding: 1rem 0;
	& .skeleton {
		width: 100%;
		height: 100%;
		display: grid;
		place-items: center;
	}
	& .announcement-list {
		position: relative;
		width: 100%;
		padding: 0 1rem 1rem 1rem;
		overflow: hidden;
		& > div {
			display: flex;
			flex-direction: column-reverse;
			justify-content: flex-start;
			height: 100%;
			overflow-y: scroll;
		}
		&.thread {
			height: 100%;
			& > div {
				display: block;
				overflow: hidden;
			}
		}
	}
	& .messages-input {
		width: 100%;
		padding: 0 1rem;
	}
`;

interface AnnouncementListProps {
	announcementId?: string;
	setThread?: any;
	thread: any;
}

export default function AnnouncementList({ announcementId, setThread, thread }: AnnouncementListProps) {
	const [loading, setLoading] = useState<boolean>(true);
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const { selectedChannel } = useSelector((state: RootState) => state.appDatas);
	const { account, currentProfile } = useSelector((state: RootState) => state.user);

	const ref = useRef<Editor>(null);

	const handleReceiveAnnouncement = useCallback(
		({ detail }: { detail: Announcement }) => {
			if (selectedChannel?.id === detail.channelId) setAnnouncements(prevState => [...prevState, detail]);
		},
		[selectedChannel]
	);

	useEffect(() => {
		const announcementThread = announcements.filter((announ: any) => announ.id === announcementId)[0];
		setThread?.(announcementThread);
		// eslint-disable-next-line
	}, [announcements, announcementId]);

	useEffect(() => {
		subscribeToEvent(EventType.RECEIVE_ANNOUNCEMENT, handleReceiveAnnouncement);
		return () => {
			unSubscribeToEvent(EventType.RECEIVE_ANNOUNCEMENT, handleReceiveAnnouncement);
		};
	}, [announcements, handleReceiveAnnouncement]);

	useEffect(() => {
		async function getChannelAnnouncements() {
			setLoading(true);
			const announcements = selectedChannel
				? await channelService.getChannelAnnouncements(selectedChannel.id || '')
				: [];
			setAnnouncements(announcements);
			setLoading(false);
		}
		if (selectedChannel) getChannelAnnouncements();
		else setLoading(false);
	}, [announcementId, selectedChannel]);

	const handleAnnouncement = async (value: string) => {
		// This will need to be made dynamic.
		const creatorAddress = account;
		if (!selectedChannel) return;
		const newAnnouncement = await announcementService.createAnnouncement(
			value,
			creatorAddress,
			selectedChannel.id || ''
		);
		setAnnouncements([...announcements, newAnnouncement]);
		websocketService.sendAnnouncement(newAnnouncement);
	};

	return (
		<AnnouncementListStyled>
			{loading ? (
				<div className="skeleton">
					<Skeleton />
				</div>
			) : announcements.length ? (
				<div id="announcement-list" className={`announcement-list ${thread ? 'thread' : ''}`}>
					<div>
						{thread ? (
							<AnnouncementItem
								announcement={thread}
								className="thread"
								authorizeComments={selectedChannel?.authorizeComments}
								isThread
							/>
						) : (
							_.orderBy(announcements, ['timestamp'], ['desc']).map((a: Announcement, i) => (
								<AnnouncementItem
									announcement={a}
									authorizeComments={selectedChannel?.authorizeComments}
									className={'border-top'}
									key={a.id + getRandomId() + i}
									sameUser={
										announcements[i].lastMessageSameCreator == announcements[i + 1]?.creatorAddress
									}
								/>
							))
						)}
					</div>
				</div>
			) : (
				<EmptyList selectedChannel={selectedChannel} />
			)}
			{(selectedChannel?.type !== 0 || (currentProfile && currentProfile.role === Role.Admin)) && !thread && (
				<div className="messages-input">
					<MessageInput
						id="sendmessage"
						imageUpload
						onSubmit={handleAnnouncement}
						placeholder={'Type your message here'}
						radius="10px"
						ref={ref}
						size={14}
						weight={600}
					/>
				</div>
			)}
		</AnnouncementListStyled>
	);
}
