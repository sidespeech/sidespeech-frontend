import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { EventType } from '../constants/EventType';
import { subscribeToEvent, unSubscribeToEvent } from '../helpers/CustomEvent';
import useWalletAddress from '../hooks/useWalletAddress';
import { Announcement } from '../models/Announcement';
import { Comment } from '../models/Comment';
import { MessageWithRoom } from '../models/Room';
import notificationService from '../services/api-services/notification.service';

interface NotificationsContextProps {
	lastAnnouncement: Announcement | null;
	lastComment: Comment | null;
	lastMessage: MessageWithRoom | null;
	newAnnouncements: Announcement[];
	newComments: Comment[];
	newMessages: MessageWithRoom[];
	onlineUsers: string[];
	staticNotifications: any[];
}

const NotificationsContextInitialState = {
	lastAnnouncement: null,
	lastComment: null,
	lastMessage: null,
	newAnnouncements: [],
	newComments: [],
	newMessages: [],
	onlineUsers: [],
	staticNotifications: []
};

const NotificationsContext = createContext<NotificationsContextProps>(NotificationsContextInitialState);

const NotificationsProvider = (props: any) => {
	const [lastAnnouncement, setLastAnnouncement] = useState<Announcement | null>(null);
	const [lastComment, setLastComment] = useState<Comment | null>(null);
	const [lastMessage, setLastMessage] = useState<MessageWithRoom | null>(null);
	const [newAnnouncements, setNewAnnouncements] = useState<Announcement[]>([]);
	const [newComments, setNewComments] = useState<Comment[]>([]);
	const [newMessages, setNewMessages] = useState<MessageWithRoom[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
	const [staticNotifications, setStaticNotifications] = useState<any[]>([]);

	const { walletAddress } = useWalletAddress();

	const getStaticNotifications = useCallback(async () => {
		try {
			if (!walletAddress) return;
			const notifications = await notificationService.getNotification(walletAddress);
			setStaticNotifications(notifications);
		} catch (error) {
			console.error(error);
		}
	}, [walletAddress]);

	const handleReceiveAnnouncement = useCallback(
		({ detail }: { detail: Announcement }) => {
			if (walletAddress) {
				setLastAnnouncement(detail);
				setNewAnnouncements(prevState => [...prevState, detail]);
			}
		},
		[walletAddress]
	);

	const handleReceiveMessage = useCallback(
		({ detail }: { detail: MessageWithRoom }) => {
			if (walletAddress) {
				setLastMessage(detail);
				setNewMessages(prevState => [...prevState, detail]);
			}
		},
		[walletAddress]
	);

	const handleReceiveComment = useCallback(
		({ detail }: { detail: Comment }) => {
			if (walletAddress) {
				setLastComment(detail);
				setNewComments(prevState => [...prevState, detail]);
			}
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
		if (walletAddress) getStaticNotifications();
	}, [walletAddress]);

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
		subscribeToEvent(EventType.RECEIVE_COMMENT, handleReceiveComment);
		return () => {
			unSubscribeToEvent(EventType.RECEIVE_COMMENT, handleReceiveComment);
		};
	}, [handleReceiveComment]);

	useEffect(() => {
		subscribeToEvent(EventType.RECEIVE_USERS_STATUS, handleUsersStatus);
		return () => {
			unSubscribeToEvent(EventType.RECEIVE_USERS_STATUS, handleUsersStatus);
		};
	}, [handleUsersStatus]);

	const value = {
		lastAnnouncement,
		lastComment,
		lastMessage,
		newAnnouncements,
		newComments,
		newMessages,
		onlineUsers,
		staticNotifications
	};

	return <NotificationsContext.Provider {...props} value={value} />;
};

export default NotificationsProvider;

export const useNotificationsContext = () => useContext(NotificationsContext);
