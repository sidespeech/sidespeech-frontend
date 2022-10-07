import { Announcement } from "./Announcement";

export class Comment {
  public content: string;
  public creatorAddress: string;
  public id: string;
  public timestamp: string;
  public announcement: Announcement;

  constructor(_data: any) {
    this.id = _data.id;
    this.timestamp = _data.timestamp;
    this.creatorAddress = _data.creatorAddress;
    this.content = _data.content;
    this.announcement = _data.announcement;
  }
}
