import { trigger } from '../../helpers/CustomEvent';
import { WEBSOCKET_URL } from '../../constants/constants';
import { io, Socket } from 'socket.io-client';
import { EventType } from '../../constants/EventType';
import { Announcement } from '../../models/Announcement';

let instance: WebSocketService;
class WebSocketService {
	public socket: Socket | null = null;

	static getInstance() {
		if (!instance) instance = new WebSocketService();
		return instance;
	}
	connectToWebSocket() {
		if (this.socket !== null || !WEBSOCKET_URL) return;
		const token = localStorage.getItem('jwtToken');
		if (!token) return;
		this.socket = io(WEBSOCKET_URL + '/', { auth: { authorization: 'Bearer ' + token } });
		this.socket.on('connect', () => {
			console.log('connected');
		});

		this.socket.on('disconnect', data => {
			trigger(EventType.RECEIVE_USERS_STATUS, data);
		});

		this.socket.on('usersStatus', data => {
			trigger(EventType.RECEIVE_USERS_STATUS, data);
		});

		this.socket.on('message', async data => {
			trigger(EventType.RECEIVE_MESSAGE, { ...data, timestamp: parseInt(data.timestamp) });
		});
		this.socket.on('newAnnouncement', async data => {
			trigger(EventType.RECEIVE_ANNOUNCEMENT, data);
		});
		this.socket.on('newComment', async data => {
			trigger(EventType.RECEIVE_COMMENT, data);
		});
		this.socket.on('newProfile', async data => {
			trigger(EventType.NEW_PROFILE, data);
		});
		this.socket.on('nft-transfert', async data => {
			trigger(EventType.NFT_TRANSFERT, data);
		});
		this.socket.on('banUser', async data => {
			trigger(EventType.BAN_USER, data);
		});
	}

	login(user: any, rooms: any) {
		this.socket?.emit('login', {
			user: { id: user.id, username: user.accounts },
			rooms: rooms
		});
	}

	async getUsersStatus(currentProfile: any) {
		await this.socket?.emit('getUsersStatus', {
			user: { username: currentProfile.username, rooms: currentProfile.rooms }
		});
	}

	sendMessage(message: string, roomId: string, sender: string) {
		this.socket?.emit('sendMessage', {
			message: message,
			roomId: roomId,
			sender: sender
		});
	}
	sendAnnouncement(announcement: Announcement) {
		this.socket?.emit('sendAnnouncement', {
			announcement,
			channelId: announcement.channelId
		});
	}
	sendComment(comment: any) {
		this.socket?.emit('sendComment', {
			comment
		});
	}

	addRoomToUsers(roomId: string, profiles: string[]) {
		this.socket?.emit('addRoomToUsers', {
			roomId,
			profiles
		});
	}
	joinSide(userId: string, sideId: string, role: number) {
		this.socket?.emit('joinSide', {
			userId,
			sideId,
			role
		});
	}

	banUser(user: any) {
		console.log('banUser method frontend', user);
		this.socket?.emit('banUser', {
			user
		});
	}

	// logout() {
	//   this.socket?.emit("login", {
	//     user: { id: user.id, username: user.accounts },
	//     rooms: rooms,
	//   });
	// }

	deconnectWebsocket() {
		if (!this.socket) return;
		this.socket.off('connect');
		this.socket.off('disconnect');
		this.socket.off('message');
	}
}
export default WebSocketService.getInstance();
