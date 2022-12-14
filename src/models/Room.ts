export class Room {
	id: string;
	name: string;
	messages: Message[] = [];
	profileIds: string[] = [];
	constructor(_data: any) {
		this.id = _data.id;
		this.name = _data.name;
		this.messages = _data.messages;
		this.profileIds = _data.profileIds;
	}

	getRoomNameForUser(username: string | undefined) {
		if (!username) return '';
		const names = this.name.split('|');
		const namesExceptUsername = names.filter(a => a !== username);
		const roomName = namesExceptUsername.join(',');
		return roomName;
	}
}

export class Message {
	id: string;
	content: string;
	sender: string;
	timestamp: number;
	lastMessageSameCreator: string;
	constructor(_data: any) {
		this.id = _data.id;
		this.content = _data.content;
		this.sender = _data.sender;
		this.timestamp = Number.parseInt(_data.timestamp);
		this.lastMessageSameCreator =  _data.lastMessageSameCreator;
	}
}

export class MessageWithRoom extends Message {
	room: Room;

	constructor(_data: any) {
		super(_data);
		this.room = _data.room;
	}
}
