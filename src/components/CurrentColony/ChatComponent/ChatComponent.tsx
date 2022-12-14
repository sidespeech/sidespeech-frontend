import styled from 'styled-components';
import { formatDistance } from 'date-fns';
import { Editor } from 'react-draft-wysiwyg';
import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { EventType } from '../../../constants/EventType';
import { subscribeToEvent, unSubscribeToEvent } from '../../../helpers/CustomEvent';
// import { timestampToLocalString } from "../../../helpers/utilities";
import { Message, Room } from '../../../models/Room';
// import {
//   addMessageToRoom,
//   updateSelectedRoomMessages,
// } from "../../../redux/Slices/ChatSlice";
import { RootState } from '../../../redux/store/app.store';
import websocketService from '../../../services/websocket-services/websocket.service';
import MessageInput from '../../ui-components/MessageInput';
import UserBadge from '../../ui-components/UserBadge';
import MessageContent from '../../ui-components/MessageContent';
import { fixURL} from '../../../helpers/utilities';
import roomService from '../../../services/api-services/room.service';
import { breakpoints, size } from '../../../helpers/breakpoints';

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
`;

interface IChatComponentProps {
	room: Room;
}

export default function ChatComponent(props: IChatComponentProps) {
	const dispatch = useDispatch();

	const ref = useRef<Editor>(null);

	const userData = useSelector((state: RootState) => state.user);
	const { selectedRoom } = useSelector((state: RootState) => state.chatDatas);
	const { currentSide } = useSelector((state: RootState) => state.appDatas);

	const [messages, setMessages] = useState<Message[]>([]);

	const handleSendMessage = (value: string) => {
		websocketService.sendMessage(value, props.room.id, userData.account || 'error');
		setMessages([
			...messages,
			new Message({
				content: value,
				timestamp: Date.now().toString(),
				sender: userData.account
			})
		]);
	};

	const handleReceiveMessage = ({ detail }: { detail: Message }) => {
		setMessages([...messages, detail]);
	};

	useEffect(() => {
		async function getRoomMessages() {
			const messages = await roomService.getRoomMessages(selectedRoom?.id || '');
			setMessages(messages);
		}
		if (selectedRoom) getRoomMessages();
	}, [selectedRoom]);

	useEffect(() => {
		subscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
		return () => {
			unSubscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
		};
	}, [messages]);

	return (
		<ChatComponentStyled>
			<div className="chat-list">
				<div>
					{_.orderBy(messages, ['timestamp'], ['desc']).map((m: Message, i) => {
						const profile = currentSide?.profiles.find(p => p.user.accounts === m.sender);
						const url = profile?.profilePicture?.metadata?.image
							? fixURL(profile.profilePicture?.metadata?.image)
							: '';
						return (
							<div className={`chat-item ${i !== 0 ? 'border-bottom' : ''}`} key={i}>
								<div className="flex w-100 gap-20">
									<UserBadge
										check
										// color={reduceWalletAddressForColor(m)}
										weight={700}
										fontSize={14}
										avatar={url}
										username={profile?.user.username || ''}
									/>
									<div className="size-11 fw-500 open-sans" style={{ color: 'var(--inactive)' }}>
										{m.timestamp
											? formatDistance(new Date(m.timestamp), new Date(), {
													addSuffix: true
											  })
											: ''}
									</div>
								</div>
								<MessageContent message={m.content} />
							</div>
						);
					})}
				</div>
			</div>
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
		</ChatComponentStyled>
	);
}
