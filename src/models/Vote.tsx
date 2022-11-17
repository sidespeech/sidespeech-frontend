import { Poll } from "./Poll";

export class Vote {
  public createdAt: Date;
  public poll: Poll;
  public selectedAnswer: number;
  public voterId: any;

  constructor(_data: any) {
    this.createdAt = _data.timestamp;
    this.voterId = _data.voterId;
    this.poll = _data.poll;
    this.selectedAnswer = _data.optionId;
  }
}
