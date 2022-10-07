import { Vote } from "./Vote";

export class Poll {
  public question: string;
  public answers: string[] = [];
  public id: string;
  public createdAt: Date;
  public updatedAt: Date;
  public creator: any;
  public votes: Vote[] = [];

  constructor(_data: any) {
    this.id = _data.id;
    this.createdAt = _data.attributes.createdAt;
    this.updatedAt = _data.attributes.updatedAt;
    this.question = _data.attributes.question;
    this.answers = _data.attributes.answers;
    this.creator = _data.attributes.creator;
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
