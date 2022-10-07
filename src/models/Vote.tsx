import { Poll } from "./Poll";

export class Vote {
  public user: any;
  public poll: Poll;
  public selectedAnswer: number;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(_data: any) {
    this.createdAt = _data.attributes.createdAt;
    this.updatedAt = _data.attributes.updatedAt;
    this.user = _data.attributes.user;
    this.poll = _data.attributes.poll;
    this.selectedAnswer = _data.attributes.selectedAnswer;
  }
}
