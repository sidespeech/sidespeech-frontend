import { Side } from './Side';
import { User } from './User';

export enum Type {
	Invitation,
	Request
}

export enum State {
	Accepted,
	Declined,
	Pending
}

export class Invitation {
	id?: string;
	createdAt?: string;
	state: number;
	sender: User;
	senderId: string;
	recipient: User;
	recipientId: string;
	invitationLink: string;
	side: Side;
	sideId: Side;

	constructor(_data: any) {
		this.id = _data.id;
		this.createdAt = _data.createdAt;
		this.state = _data.state;
		this.sender = _data.sender;
		this.senderId = _data.senderId;
		this.recipient = _data.recipient;
		this.recipientId = _data.recipientId;
		this.invitationLink = _data.invitationLink;
		this.side = new Side(_data.side);
		this.sideId = _data.sideId;
	}
}
