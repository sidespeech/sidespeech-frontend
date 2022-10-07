import { create } from "lodash";
import superagent from "superagent";
import { BASE_URL } from "../constants/constants";
import { Room } from "../models/Room";
import { Side } from "../models/Side";
import { User } from "../models/User";

// Create an API Service class
class apiService {
  // Method that will manage sending the wallet connection.
  static async walletConnection(accounts: any): Promise<User> {
    const createUser = await superagent
      .post(`${BASE_URL}/user`)
      .send({ accounts: accounts[0], publicNfts: "TBD" })
      .set("accept", "json");
    return createUser.body;
  }

  static async getUserByAddress(address: string): Promise<User> {
    const res = await superagent.get(`${BASE_URL}/user/${address}`);
    return new User(res.body);
  }

  static async getProfileById(id: string): Promise<any> {
    const res = await superagent.get(`${BASE_URL}/profile`).query({ id });
    return res.body;
  }

  static async getSideById(id: string): Promise<Side> {
    const res = await superagent.get(`${BASE_URL}/side/${id}`);
    return res.body;
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
    creatorAddress: any
  ): Promise<any> {
    const createAnnouncement = await superagent
      .post(`${BASE_URL}/announcement`)
      .send({ content: announcement, creatorAddress: creatorAddress })
      .set("accept", "json");

    return createAnnouncement.body;
  }

  // Get all the announcements
  static async getAnnouncements(): Promise<any> {
    const res = await superagent.get(`${BASE_URL}/announcement`);
    return res.body;
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
      .set("accept", "json")
      .end((err, res) => {
        console.log(res);
      });
  }

  // Grab all the comments.
  static async getComents(): Promise<any> {
    const res = await superagent.get(`${BASE_URL}/comments`);
    return res.body;
  }
}

export { apiService };
