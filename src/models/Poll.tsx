import { Vote } from "./Vote";

export class Poll {
  public question: string;
  public answers: string[] = [];
  public id: string;
  public createdAt: string;
  public creator: any;
  public votes: Vote[] = [];
  public pollOption: any;

  constructor(_data: any) {
    this.id = _data.id;
    this.createdAt = _data.timestamp;
    this.question = _data.question;
    this.answers = _data.options;
    this.creator = _data.creatorId;
    this.pollOption = _data.pollOption;
    this.votes = _data.vote;
  }

  async getVotes(votes: any) {
    if (!votes)
      return;
    const as = await votes.query().find();
    await Promise.all(
      as.map(async (a: any) => {
        const vote = new Vote(a);
        this.votes.push(vote);
      })
    );
  }

}
