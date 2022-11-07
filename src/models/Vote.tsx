import { Poll } from "./Poll";

export class Vote {
  public user: any;
  public poll: Poll;
  public selectedAnswer: number;
  public createdAt: Date;

  constructor(_data: any) {
    console.log('Vote Modal: ', _data);
    this.createdAt = _data.timestamp;
    this.user = _data.voterId;
    this.poll = _data.poll;
    this.selectedAnswer = _data.optionId;
  }
}
