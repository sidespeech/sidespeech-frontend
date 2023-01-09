import styled from 'styled-components';
import { formatDistance } from 'date-fns';
import { Editor } from 'react-draft-wysiwyg';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { EventType } from '../../../constants/EventType';
import { subscribeToEvent, unSubscribeToEvent } from '../../../helpers/CustomEvent';
import { Message, Room } from '../../../models/Room';
import { RootState } from '../../../redux/store/app.store';
import websocketService from '../../../services/websocket-services/websocket.service';
import MessageInput from '../../ui-components/MessageInput';
import UserBadge from '../../ui-components/UserBadge';
import MessageContent from '../../ui-components/MessageContent';
import { fixURL } from '../../../helpers/utilities';
import roomService from '../../../services/api-services/room.service';
import { breakpoints, size } from '../../../helpers/breakpoints';
import Skeleton from '../../ui-components/Skeleton';
import { User } from '../../../models/User';
import emptyScreenImg from '../../../assets/channel_empty_screen_shape.svg';
import { useNotificationsContext } from '../../../providers/NotificationsProvider';
import useWalletAddress from '../../../hooks/useWalletAddress';

const EmptyListStyled = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	.empty-list_wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-image: url(${emptyScreenImg});
		background-repeat: no-repeat;
		background-size: contain;
		background-position: center bottom;
		width: 580px;
		margin-top: 15vh;
		padding-bottom: 10rem;
		& .empty-list_icon {
			display: block;
			background-color: var(--disable);
			padding: 1.2rem;
			border-radius: 10rem;
			& svg {
				transform: scale(1.4);
				& path {
					fill: var(--text);
				}
			}
		}
		& .empty-list_title {
			margin-bottom: 0.5rem;
			text-align: center;
		}
		& .empty-list_description {
			color: var(--inactive);
		}
	}
`;

const ChatComponentStyled = styled.div`
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
	& .chat-list {
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
	& .chat-item {
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
	}
	& .messages-input {
		width: 100%;
		padding: 0 1rem;
	}
	.border-top {
		border-top: 1px solid var(--disable);
	}
	.no-border {
		border: none!important;
		padding-top: 0;
	}
`;

interface IChatComponentProps {
	room: Room;
}

export default function ChatComponent(props: IChatComponentProps) {
	const [loading, setLoading] = useState<boolean>(true);

	const ref = useRef<Editor>(null);

	const userData = useSelector((state: RootState) => state.user);
	const { selectedRoom } = useSelector((state: RootState) => state.chatDatas);
	const { currentSide } = useSelector((state: RootState) => state.appDatas);

	const [messages, setMessages] = useState<Message[]>([]);

	const { lastMessage } = useNotificationsContext();
	const { walletAddress } = useWalletAddress();

	const handleSendMessage = (value: string) => {
		websocketService.sendMessage(value, props.room.id, userData.account || 'error', currentSide!['id']);

		let lastMessage = messages.slice(-1).pop();
		let lastMessageSameCreator = lastMessage?.sender === userData.account;

		setMessages([
			...messages,
			new Message({
				content: value,
				timestamp: Date.now().toString(),
				sender: userData.account,
				lastMessageSameCreator: lastMessageSameCreator,
			})
		]);
	};

	useEffect(() => {
		async function getRoomMessages() {
			try {
				setLoading(true);
				const messages = await roomService.getRoomMessages(selectedRoom?.id || '');
				setMessages(messages);
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		}
		if (selectedRoom) getRoomMessages();
		else setLoading(false);
	}, [selectedRoom]);

	useEffect(() => {
		if (walletAddress && lastMessage && lastMessage.room?.id === selectedRoom?.id)
			setMessages(prevState => [...prevState, lastMessage]);
	}, [lastMessage, walletAddress]);

	const getUserBySenderId = (senderId: string): User | undefined => {
		const profile = currentSide?.profiles.find(p => p.user.accounts?.toLowerCase() === senderId?.toLowerCase());
		return profile?.user;
	};

	return (
		<ChatComponentStyled>
			{loading ? (
				<div className="skeleton">
					<Skeleton />
				</div>
			) : (
				<>
					{messages.length ? (
						<div className="chat-list">
							<div>
								{_.orderBy(messages, ['timestamp'], ['desc']).map((m: Message, i) => {
									const user = getUserBySenderId(m.sender);
									const url = user?.userAvatar?.metadata?.image || '';
									const username = user?.username || '';
									return (
										<div className={`chat-item ${i !== 0 ? 'border-top' : ''} ${!m.lastMessageSameCreator ? 'border' : 'no-border'}`} key={i}>
											{!m.lastMessageSameCreator ? (
											<div className="flex w-100 gap-20">
												<UserBadge
													check
													// color={reduceWalletAddressForColor(m)}
													weight={700}
													fontSize={14}
													avatar={url}
													username={username}
												/>
												
												<div
													className="size-11 fw-500 open-sans"
													style={{ color: 'var(--inactive)' }}
												>
													{m.timestamp
														? formatDistance(new Date(m.timestamp), new Date(), {
																addSuffix: true
														  })
														: ''}
												</div>
											</div>
											) : null}
											<MessageContent message={m.content} />
										</div>
									);
								})}
							</div>
						</div>
					) : (
						<EmptyListStyled>
							<div className="empty-list_wrapper">
								<h2 className="empty-list_title">Welcome</h2>
								<p className="empty-list_description">This is the beginning of the chat!</p>
							</div>
						</EmptyListStyled>
					)}
					<div className="messages-input">
						<MessageInput
							height={55}
							imageUpload
							onSubmit={handleSendMessage}
							placeholder={''}
							radius="10px"
							ref={ref}
							size={14}
							weight={600}
						/>
					</div>
				</>
			)}
		</ChatComponentStyled>
	);
}
