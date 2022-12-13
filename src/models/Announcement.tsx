import { Comment } from './Comment';

export class Announcement {
    public content: string;
    public creatorAddress: string;
    public id: string;
    public timestamp: string;
    public comments: Comment[] = [];
    public channelId: string;
    public lastMessageSameCreator: string;

    constructor(_data: any) {
        this.id = _data.id;
        this.timestamp = _data.timestamp;
        this.creatorAddress = _data.creatorAddress;
        this.content = _data.content;
        this.channelId = _data.channelId;
        this.comments = _data.comments;
        this.lastMessageSameCreator = _data.lastMessageSameCreator;
    }
}
