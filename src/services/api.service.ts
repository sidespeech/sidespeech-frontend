import superagent from "superagent";
import { InitialState } from "../components/Modals/CreateColonyModal";
import { BASE_URL } from "../constants/constants";
import { Announcement } from "../models/Announcement";
import { Channel, ChannelType } from "../models/Channel";
import { Comment } from "../models/Comment";
import { Profile } from "../models/Profile";
import { Message, Room } from "../models/Room";
import { Side } from "../models/Side";
import { User } from "../models/User";

// Create an API Service class
class apiService {
  // Method that will manage sending the wallet connection.
  static async walletConnection(accounts: any, signature: any): Promise<User> {
    const createUser = await superagent
      .post(`${BASE_URL}/user`)
      .send({ accounts: accounts[0], publicNfts: "TBD", signature: signature })
      .set("accept", "json");

    return new User(createUser.body);
  }

  static async getUserByAddress(address: string): Promise<User> {
    const res = await superagent.get(`${BASE_URL}/user/${address}`);
    return new User(res.body);
  }

  static async getProfileById(id: string): Promise<Profile> {
    const res = await superagent.get(`${BASE_URL}/profile`).query({ id });
    return new Profile(res.body);
  }

  static async getSideById(id: string): Promise<Side> {
    const res = await superagent.get(`${BASE_URL}/side/${id}`);
    return new Side(res.body);
  }
  
  static async createSide(side: InitialState): Promise<Side> {
    console.log("side :", side);
    const res = await superagent.post(`${BASE_URL}/side`).send(side);
    console.log(res["body"]["side"]);
    return res["body"]["side"];
  }

  static async createRoom(id: string, id2: string): Promise<Room> {
    const res = await superagent
      .post(`${BASE_URL}/room`)
      .send({ profileIds: [id, id2] });
    return new Room(res.body);
  }
  // This method will create an announcement call to the API
  static async createAnnouncement(
    announcement: any,
    creatorAddress: any,
    channelId: string
  ): Promise<Announcement> {
    const createAnnouncement = await superagent
      .post(`${BASE_URL}/announcement`)
      .send({
        content: announcement,
        creatorAddress: creatorAddress,
        channelId,
        timestamp: Date.now().toString(),
      })
      .set("accept", "json");

    return new Announcement(createAnnouncement.body);
  }

  // Get all the announcements
  static async getAnnouncements(): Promise<any> {
    const res = await superagent.get(`${BASE_URL}/announcement`);
    return res.body.map((a: any) => new Announcement(a));
  }

  // This method will send the comment to the API
  static async sendComment(
    comment: any,
    creatorAddress: any,
    announcementId: string
  ): Promise<any> {
    const sendComment = await superagent
      .post(`${BASE_URL}/comment`)
      .send({
        content: comment,
        creatorAddress: creatorAddress,
        announcementId: announcementId,
        timestamp: Date.now().toString(),
      })
      .set("accept", "json");

    return new Comment(sendComment.body);
  }

  // Grab all the comments.
  static async getComents(): Promise<any> {
    const res = await superagent.get(`${BASE_URL}/comments`);
    return res.body.map((c: any) => new Comment(c));
  }

  static async getRoomMessages(id: string): Promise<Message[]> {
    const res = await superagent.get(`${BASE_URL}/room/messages`).query({ id });
    return res.body.map((m: any) => new Message(m));
  }
  static async getChannelAnnouncements(id: string): Promise<Announcement[]> {
    const res = await superagent
      .get(`${BASE_URL}/channel/announcements`)
      .query({ id });
    return res.body.map((m: any) => new Announcement(m));
  }

  static async createChannel(
    sideId: string,
    name: string,
    type: ChannelType
  ): Promise<Channel> {
    const res = await superagent
      .post(`${BASE_URL}/channel`)
      .send({ sideId, name, type, isVisible: true });
    return new Channel(res.body);
  }
}

export { apiService };
