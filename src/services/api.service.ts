import { Vote } from './../models/Vote';
import superagent from "superagent";
import { InitialStateProfile } from "../components/CurrentColony/settings/account/account";
import { InitialStateUpdateSide } from "../components/CurrentColony/settings/informations/informations";
import { InitialStateSide } from "../components/new-side/new-side";
import { InitialState } from "../components/Modals/CreateColonyModal";
import { BASE_URL } from "../constants/constants";
import { Announcement } from "../models/Announcement";
import { Channel, ChannelType } from "../models/Channel";
import { Comment } from "../models/Comment";
import { NFT } from "../models/interfaces/nft";
import { Profile } from "../models/Profile";
import { Message, Room } from "../models/Room";
import { Side } from "../models/Side";
import { User } from "../models/User";
import { Notification } from "../models/Notification";
import { Poll } from "../models/Poll";
import { InitialStateUser } from "../components/GeneralSettings/Account/UserGeneralInformations";
import { Invitation } from "../models/Invitation";

// Create an API Service class
class apiService {

  // Method that will manage sending the wallet connection.
  static async walletConnection(accounts: any, signature: any): Promise<User> {
    const retrieveNFTs = "";

    const createUser = await superagent
      .post(`${BASE_URL}/user`)
      .send({
        accounts: accounts[0],
        publicNfts: retrieveNFTs,
        signature: signature,
      })
      .set("accept", "json");

    return new User(createUser.body);
  }

  static async findExistingWallet(accounts: string) {
    const checkUser = await superagent.get(
      `${BASE_URL}/user/existing/${accounts}`
    );

    return checkUser.body;
  }

  static async getUserByAddress(address: string): Promise<User> {
    const res = await superagent.get(`${BASE_URL}/user/${address}`);
    if (!res.body) throw new Error('Error')
    return new User(res.body);
  }

  static async getProfileById(id: string): Promise<Profile> {
    const res = await superagent.get(`${BASE_URL}/profile`).query({ id });
    return new Profile(res.body);
  }

  static async joinSide(userId: string, sideId: string,role: number): Promise<Profile> {
    const res = await superagent
      .post(`${BASE_URL}/profile/join`)
      .send({ userId, sideId, role });
    return new Profile(res.body);
  }

  static async updateProfile(
    id: string,
    profile: InitialStateProfile
  ): Promise<Profile> {
    const res = await superagent
      .patch(`${BASE_URL}/profile/${id}`)
      .send(profile);
    console.log(res["body"]);
    return res["body"];
  }
  static async updateUser(
    id: string,
    updatedInfo: InitialStateUser
  ): Promise<any> {
    const res = await superagent
      .patch(`${BASE_URL}/user/${id}`)
      .send(updatedInfo);
    return res["body"];
  }
  static async updateUserPublicNfts(
    id: string,
    updatedInfo: NFT[]
  ): Promise<any> {
    const res = await superagent
      .patch(`${BASE_URL}/user/saveNfts/${id}`)
      .send(updatedInfo);
    return res["body"];
  }

  static async getSideById(id: string): Promise<Side> {
    const res = await superagent.get(`${BASE_URL}/side/${id}`);
    return new Side(res.body);
  }
  static async isSideNameExist(name: string): Promise<boolean> {
    const res = await superagent
      .get(`${BASE_URL}/side/name/exist`)
      .query({ name: name });
    return res.body.exist;
  }
  static async createSide(side: InitialStateSide): Promise<Side> {
    const res = await superagent.post(`${BASE_URL}/side`).send(side);
    return new Side(res["body"]);
  }

  static async updateSide(
    side: InitialStateUpdateSide,
    id: string
  ): Promise<Side> {
    const res = await superagent.patch(`${BASE_URL}/side/${id}`).send(side);
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

  static async createManyChannels(channels: Channel[]): Promise<any> {
    const res = await superagent
      .post(`${BASE_URL}/channel/many`)
      .send(channels);
    return res.body.raw;
  }

  static async updateManyChannels(channels: Channel[]): Promise<any> {
    const res = await superagent
      .patch(`${BASE_URL}/channel/many`)
      .send(channels);
    return res["body"];
  }
  static async removeChannels(ids: string | string[]): Promise<any> {
    const res = await superagent
      .delete(`${BASE_URL}/channel/many`)
      .send({ ids: ids });
    return res.body;
  }

  static async uploadImage(image: FormData): Promise<any> {
    const res = await superagent
      .post(`${BASE_URL}/files`)
      .send(image)
    return res.text || '';
  }
  static async createPoll(
    creatorId: string,
    question: string,
    isProposed: boolean,
    options: any,
    timestamp: string
  ): Promise<Poll> {
    const res = await superagent
      .post(`${BASE_URL}/poll`)
      .send({ creatorId, question, isProposed, options, timestamp });
    return new Poll(res.body);
  }

  static async getChannelPolls(
  ): Promise<Poll[]> {
    const res = await superagent
      .get(`${BASE_URL}/poll`);
    return res.body.map((m: any) => new Poll(m));
  }

  static async voteOnPoll(
    voterId: string,
    option_id: string,
    timestamp: string
  ): Promise<Vote> {
    const res = await superagent
      .post(`${BASE_URL}/vote`)
      .send({ voterId, option_id, timestamp });
    return new Vote(res.body);
  }

  // Fetch notification by channel id and user wallet address
  static async getNotification(address:string): Promise<any> {
    const res = await superagent.get(`${BASE_URL}/notification/allNotifications/${address}`);
    return res.body.map((c: any) => new Notification(c));
  }

  // remove notification by channel id and user wallet address
  static async deleteNotification(id:string, address:string): Promise<any> {
    const res = await superagent.delete(`${BASE_URL}/notification/${id}/${address}`);
    return new User(res.body);
  }

  static async getUserFromSides(sides:Side[]): Promise<any> {
    const res = await superagent.post(`${BASE_URL}/user/side`).send({sides: sides});
    return res.body.users;
  }

  static async sendInvitation(invitation:Invitation): Promise<any> {
    console.log(invitation)
    const res = await superagent.post(`${BASE_URL}/invitation`).send(invitation);
    return res.body;
  } 

  static async sendMultipleInvitations(invitations:Invitation[]): Promise<any> {
    console.log(invitations)
    const res = await superagent.post(`${BASE_URL}/invitation/many`).send(invitations);
    return res.body;
  } 

}


export { apiService };
