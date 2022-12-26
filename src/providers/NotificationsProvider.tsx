import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { EventType } from '../constants/EventType';
import { subscribeToEvent, unSubscribeToEvent } from '../helpers/CustomEvent';
import useWalletAddress from '../hooks/useWalletAddress';
import { Announcement } from '../models/Announcement';
import { MessageWithRoom } from '../models/Room';

interface NotificationsContextProps {
	newAnnouncements: Announcement[];
	newMessages: MessageWithRoom[];
	onlineUsers: string[];
}

const NotificationsContextInitialState = {
	newAnnouncements: [],
	newMessages: [],
	onlineUsers: []
};

const NotificationsContext = createContext<NotificationsContextProps>(NotificationsContextInitialState);

const NotificationsProvider = (props: any) => {
	const [newAnnouncements, setNewAnnouncements] = useState<Announcement[]>([]);
	const [newMessages, setNewMessages] = useState<MessageWithRoom[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

	const { walletAddress } = useWalletAddress();

	const handleReceiveAnnouncement = useCallback(
		({ detail }: { detail: Announcement }) => {
			if (walletAddress) setNewAnnouncements(prevState => [...prevState, detail]);
		},
		[walletAddress]
	);

	const handleReceiveMessage = useCallback(
		({ detail }: { detail: MessageWithRoom }) => {
			if (walletAddress) setNewMessages(prevState => [...prevState, detail]);
		},
		[walletAddress]
	);

	const handleUsersStatus = useCallback(
		({ detail }: { detail: any }) => {
			let onlineUsersObj: any = [];
			if (detail !== 'transport close') {
				for (let socket of detail) onlineUsersObj.push(socket['user']['username']);
				setOnlineUsers(onlineUsersObj);
			}
		},
		[walletAddress]
	);

	useEffect(() => {
		subscribeToEvent(EventType.RECEIVE_ANNOUNCEMENT, handleReceiveAnnouncement);
		return () => {
			unSubscribeToEvent(EventType.RECEIVE_ANNOUNCEMENT, handleReceiveAnnouncement);
		};
	}, [handleReceiveAnnouncement]);

	useEffect(() => {
		subscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
		return () => {
			unSubscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
		};
	}, [handleReceiveMessage]);

	useEffect(() => {
		subscribeToEvent(EventType.RECEIVE_USERS_STATUS, handleUsersStatus);
		return () => {
			unSubscribeToEvent(EventType.RECEIVE_USERS_STATUS, handleUsersStatus);
		};
	}, [handleUsersStatus]);

	const value = {
		newAnnouncements,
		newMessages,
		onlineUsers
	};

	return <NotificationsContext.Provider {...props} value={value} />;
};

export default NotificationsProvider;

export const useNotificationsContext = () => useContext(NotificationsContext);
