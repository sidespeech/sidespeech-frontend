import { Announcement } from './Announcement';
import { Side } from './Side';

export enum ChannelType {
	Announcement,
	Poll,
	Textual
}

export class Channel {
	polls?(polls: any, arg1: string) {
		return [];
	}
	id: string;
	name: string;
	isVisible: boolean;
	type: ChannelType;
	announcements?: Announcement[];
	side: Partial<Side>;
	authorizeComments?: boolean;
	index: number;

	constructor(_data: any) {
		this.id = _data.id;
		this.name = _data.name;
		this.isVisible = _data.isVisible;
		this.type = _data.type;
		this.announcements = _data.announcements;
		this.side = _data.side;
		this.authorizeComments = _data.authorizeComments;
		this.index = _data.index;
	}
}
