import { Room } from "./Room";
import { Side } from "./Side";
import { User } from "./User";

export enum Role {
  Admin,
  User,
}

export class Profile {
  id: string;
  username: string;
  showNfts: boolean;
  role: Role;
  profilePicture: string;

  rooms: Room[];

  side: Side;
  user: User;

  constructor(_data: any){
    this.id = _data.id
    this.username = _data.username
    this.showNfts = _data.showNfts
    this.role = _data.role
    this.profilePicture = _data.profilePicture
    this.rooms = _data.rooms
    this.side  = _data.side
    this.user = _data.user;
  }
}
