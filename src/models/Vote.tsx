import { Poll } from "./Poll";

export class Vote {
  public createdAt: Date;
  public poll: Poll;
  public voterId: any;
  public option: any;

  constructor(_data: any) {
    this.createdAt = _data.timestamp;
    this.voterId = _data.voterId;
    this.poll = _data.poll;
    this.option = _data.option;
  }
}
