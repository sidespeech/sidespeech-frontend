import { Announcement } from "./Announcement";
import { Side } from "./Side";

export enum ChannelType {
    Announcement,
    Poll,
    Textual
  }

export class Channel {
  id: string;
  name: string;
  isVisible: boolean;
  type: ChannelType;
  announcements: Announcement[];
  side: Side;

  constructor(_data: any){
    this.id = _data.id;
    this.name = _data.name;
    this.isVisible = _data.isVisible;
    this.type = _data.type;
    this.announcements = _data.announcements;
    this.side = _data.side;
  }
}
