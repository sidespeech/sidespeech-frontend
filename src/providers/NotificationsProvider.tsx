import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { EventType } from '../constants/EventType';
import { subscribeToEvent, unSubscribeToEvent } from '../helpers/CustomEvent';
import useWalletAddress from '../hooks/useWalletAddress';
import { Announcement } from '../models/Announcement';
import { Comment } from '../models/Comment';
import { MessageWithRoom } from '../models/Room';
import { RootState } from '../redux/store/app.store';
import notificationService from '../services/api-services/notification.service';

interface NotificationsContextProps {
	clearNotificationsState: () => void;
	getStaticNotifications: () => void;
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
	clearNotificationsState: () => {},
	getStaticNotifications: () => {},
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
	const { currentSide } = useSelector((state: RootState) => state.appDatas);

	const clearNotificationsState = useCallback((onlineUsers = true) => {
		setLastAnnouncement(NotificationsContextInitialState.lastAnnouncement);
		setLastComment(NotificationsContextInitialState.lastComment);
		setLastMessage(NotificationsContextInitialState.lastMessage);
		setNewAnnouncements(NotificationsContextInitialState.newAnnouncements);
		setNewComments(NotificationsContextInitialState.newComments);
		setNewMessages(NotificationsContextInitialState.newMessages);
		if (onlineUsers) setOnlineUsers(NotificationsContextInitialState.onlineUsers);
		setStaticNotifications(NotificationsContextInitialState.staticNotifications);
	}, []);

	const getStaticNotifications = useCallback(async () => {
		try {
			if (!walletAddress) return;
			clearNotificationsState(false);
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
				for (let socket of detail) onlineUsersObj.push(socket?.['user']?.['username']);
				setOnlineUsers(onlineUsersObj);
			}
		},
		[walletAddress]
	);

	useEffect(() => {
		if (walletAddress) getStaticNotifications();
	}, [currentSide, walletAddress]);

	useEffect(() => {
		subscribeToEvent(EventType.RECEIVE_ANNOUNCEMENT, handleReceiveAnnouncement);
		return () => {
			unSubscribeToEvent(EventType.RECEIVE_ANNOUNCEMENT, handleReceiveAnnouncement);
			clearNotificationsState();
		};
	}, [clearNotificationsState, handleReceiveAnnouncement]);

	useEffect(() => {
		subscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
		return () => {
			unSubscribeToEvent(EventType.RECEIVE_MESSAGE, handleReceiveMessage);
			clearNotificationsState();
		};
	}, [clearNotificationsState, handleReceiveMessage]);

	useEffect(() => {
		subscribeToEvent(EventType.RECEIVE_COMMENT, handleReceiveComment);
		return () => {
			unSubscribeToEvent(EventType.RECEIVE_COMMENT, handleReceiveComment);
			clearNotificationsState();
		};
	}, [clearNotificationsState, handleReceiveComment]);

	useEffect(() => {
		subscribeToEvent(EventType.RECEIVE_USERS_STATUS, handleUsersStatus);
		return () => {
			unSubscribeToEvent(EventType.RECEIVE_USERS_STATUS, handleUsersStatus);
			clearNotificationsState();
		};
	}, [clearNotificationsState, handleUsersStatus]);

	const value = {
		clearNotificationsState,
		getStaticNotifications,
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
