import { Channel } from "./Channel";
import { Comment } from "./Comment";

export class Announcement {
  public content: string;
  public creatorAddress: string;
  public id: string;
  public timestamp: string;
  public comments: Comment[] = [];
  public channel: Channel;

  constructor(_data: any) {
    this.id = _data.id;
    this.timestamp = _data.timestamp;
    this.creatorAddress = _data.creatorAddress;
    this.content = _data.content;
    this.channel = _data.channel;
  }
}
