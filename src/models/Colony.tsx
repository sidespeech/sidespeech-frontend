import Web3 from "web3";
import Moralis from "moralis";
export class Colony {
  public CreatorAddress: string;
  public members: any[] = [];
  public WebsiteUrl: string;
  public channels: Channel[] = [];
  public cover: string;
  public createdAt: Date;
  public updatedAt: Date;
  public image: string;
  public name: string;
  public nftTokenAddress: string;
  public id: string;
  public channelsId: string[];
  public tokenRequired: number;
  public moralisColony: Moralis.Object;

  constructor(_data: any) {
    this.CreatorAddress = _data.attributes.CreatorAddress;
    this.WebsiteUrl = _data.attributes.WebsiteUrl;
    this.channelsId = _data.attributes.channels.map((c: any) => c.id);
    this.cover = _data.attributes.cover?._url;
    this.createdAt = _data.attributes.createdAt;
    this.updatedAt = _data.attributes.updatedAt;
    this.image = _data.attributes.image?._url;
    this.name = _data.attributes.name;
    this.nftTokenAddress = _data.attributes.nftTokenAddress;
    this.id = _data.id;
    this.tokenRequired = _data.attributes.tokenRequired;
    this.moralisColony = _data;
  }

  isCreator(address: string) {
    if(!address) return false;
    return this.CreatorAddress.toLowerCase() === address.toLowerCase();
  }
  async getMembers() {
    console.log(this.id)
    this.members = await Moralis.Cloud.run(
      "getColoniesMembers",
      {id :this.id}
    );
    console.log(this.members)
  }
}

export class Channel {
  public id: string;
  public name: string;
  public type: string;
  public announcements: Announcement[] = [];
  public polls: Poll[] = [];
  public isVisible: boolean;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(_data: any) {
    this.id = _data.id;
    this.name = _data.attributes.name;
    this.isVisible = _data.attributes.isVisible;
    this.type = _data.attributes.type;
    this.createdAt = _data.attributes.createdAt;
    this.updatedAt = _data.attributes.updatedAt;
  }

  async getAnnouncements(announcements: any) {
    if (!announcements) return;
    const as = await announcements.query().find();
    await Promise.all(
      as.map(async (a: any) => {
        const newAnnouncement = new Announcement(a);
        await newAnnouncement.getComments(a.attributes.comments);
        this.announcements.push(newAnnouncement);
      })
    );
  }
  async getPolls(polls: any) {
    if (!polls) return;
    const as = await polls.query().find();
    await Promise.all(
      as.map(async (a: any) => {
        const newPoll = new Poll(a);
        await newPoll.getVotes(a.attributes.votes)
        this.polls.push(newPoll);
      })
    );
  }
}
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
    if (!votes) return;
    const as = await votes.query().find();
    await Promise.all(
      as.map(async (a: any) => {
        const vote = new Vote(a);
        this.votes.push(vote);
      })
    );
  }
}
export class Vote {
  public user: any;
  public poll: Poll;
  public selectedAnswer: number;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(_data: any){
    this.createdAt = _data.attributes.createdAt;
    this.updatedAt = _data.attributes.updatedAt;
    this.user = _data.attributes.user;
    this.poll = _data.attributes.poll;
    this.selectedAnswer = _data.attributes.selectedAnswer;
  }

}
export class Announcement {
  public content: string;
  public creator: any;
  public id: string;
  public createdAt: Date;
  public updatedAt: Date;
  public comments: Comment[] = [];

  constructor(_data: any) {
    this.id = _data.id;
    this.createdAt = _data.attributes.createdAt;
    this.updatedAt = _data.attributes.updatedAt;
    this.creator = _data.attributes.creator;
    this.content = _data.attributes.content;
  }
  async getComments(comments: any) {
    if (!comments) return;
    const as = await comments.query().find();
    as.forEach((a: any) => {
      this.comments.push(new Comment(a));
    });
  }
}

export class Comment {
  public content: string;
  public creator: any;
  public id: string;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(_data: any) {
    this.id = _data.id;
    this.createdAt = _data.attributes.createdAt;
    this.updatedAt = _data.attributes.updatedAt;
    this.creator = _data.attributes.creator;
    this.content = _data.attributes.content;
  }
}


