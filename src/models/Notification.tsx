import { User } from "./User";

export class Notification {
  public name: string;
  public creatorAddress: string;
  public id: string;
  public timestamp: string;

  constructor(_data: any) {
    this.id = _data.id;
    this.timestamp = _data.timestamp;
    this.creatorAddress = _data.creatorAddress;
    this.name = _data.name;
  }
}
