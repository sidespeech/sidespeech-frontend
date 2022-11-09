import { Side } from "./Side";
import { User } from "./User";

export class Invitation {
  id?:string;
  createdAt?: string;
  state: number;
  sender: User;
  recipient: User;
  invitationLink: string;
  side: Side;

  constructor(_data: any) {
    this.id = _data.id;
    this.createdAt = _data.createdAt;
    this.state = _data.state;
    this.sender = _data.sender;
    this.recipient = _data.recipient;
    this.invitationLink = _data.invitationLink;
    this.side = _data.side;
  }
}
