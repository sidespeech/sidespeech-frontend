import { Vote } from "./../models/Vote";
import superagent from "superagent";
import { InitialStateUpdateSide } from "../components/CurrentColony/settings/informations/Informations";
import { InitialStateSide } from "../components/NewSide/NewSide";
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
import { Invitation } from "../models/Invitation";
import { Collection } from "../models/interfaces/collection";
import _ from "lodash";
import { Metadata } from "../models/Metadata";
import { InitialStateUser } from "../components/GeneralSettings/Account/GeneralSettingsAccount";

// Create an API Service class

const post = (url: string) => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return superagent.post(url);
  return superagent.post(url).auth(token, { type: "bearer" });
};
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
    const checkUser = await superagent
    .post(`${BASE_URL}/user/existing`)
    .send({
      accounts: accounts
    })
    return checkUser.body;
  }

  static async findOnBoarding(accounts: string) {
    const checkUser = await superagent.get(
      `${BASE_URL}/user/onboarding/${accounts}`
    );

    return checkUser.body;
  }

  static async findExistingUsername(username: string) {
    const checkUser = await superagent.get(
      `${BASE_URL}/user/username/${username}`
    );
    return checkUser.body;
  }

  static async getUserByAddress(address: string): Promise<User> {
    const res = await superagent.get(`${BASE_URL}/user/${address}`);
    if (!res.body) throw new Error("Error");
    return new User(res.body);
  }
  static async getUserPublicData(username: string): Promise<User> {
    const res = await superagent.get(`${BASE_URL}/user/public/${username}`);
    if (!res.body) throw new Error("Error");
    return new User(res.body);
  }

  static async getProfileById(id: string): Promise<Profile> {
    const res = await superagent.get(`${BASE_URL}/profile`).query({ id });
    return new Profile(res.body);
  }

  static async getProfilesByUserId(id: string): Promise<Profile> {
    const res = await superagent.get(`${BASE_URL}/profile/user`).query({ id });
    return new Profile(res.body);
  }

  static async joinSide(
    userId: string,
    sideId: string,
    role: number
  ): Promise<Profile> {
    const res = await post(`${BASE_URL}/profile/join`).send({
      userId,
      sideId,
      role,
    });
    return new Profile(res.body);
  }

  static async updateProfile(
    id: string,
    profile: Partial<Profile>
  ): Promise<Profile> {
    const res = await superagent
      .patch(`${BASE_URL}/profile/${id}`)
      .send(profile);
    return new Profile(res["body"]);
  }
  static async updateProfilePicture(
    id: string,
    profilePicture: NFT
  ): Promise<Profile> {
    const res = await superagent.put(`${BASE_URL}/profile/picture`).send({
      profileId: id,
      profileNftStringify: JSON.stringify(profilePicture),
    });
    return new Profile(res["body"]);
  }
  static async updateUser(
    id: string,
    updatedInfo: InitialStateUser
  ): Promise<any> {
    const res = await superagent
      .patch(`${BASE_URL}/user/${id}`)
      .send(updatedInfo);
    return new User(res["body"]);
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

  // This method will send the comment to the API
  static async commentPoll(
    comment: any,
    creatorAddress: any,
    pollId: string
  ): Promise<any> {
    const sendComment = await superagent
      .post(`${BASE_URL}/poll/${pollId}/comment`)
      .send({
        content: comment,
        creatorAddress: creatorAddress,
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

  static async getCommentByAnnoucementId(id: string): Promise<Comment[]> {
    const res = await superagent.get(`${BASE_URL}/comment/announcement/${id}`);
    return res.body.map((m: any) => new Comment(m));
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

  static async uploadImage(image: FormData): Promise<string> {
    const res = await superagent.post(`${BASE_URL}/files`).send(image);
    return res.text || "";
  }
  static async createPoll(
    channelId: string,
    creatorId: string,
    proposalTitle: string,
    endDate: string,
    question: string,
    isProposed: boolean,
    options: any,
    timestamp: string
  ): Promise<Poll> {
    const res = await superagent.post(`${BASE_URL}/poll`).send({
      channelId,
      creatorId,
      proposalTitle,
      endDate,
      question,
      isProposed,
      options,
      timestamp,
    });
    return new Poll(res.body);
  }

  static async getChannelPolls(channelId: string): Promise<Poll[]> {
    const res = await superagent.get(`${BASE_URL}/channel/${channelId}/polls`);
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
  static async getNotification(address: string): Promise<any> {
    const res = await superagent.get(
      `${BASE_URL}/notification/allNotifications/${address}`
    );
    return res.body.map((c: any) => new Notification(c));
  }

  // remove notification by channel id and user wallet address
  static async deleteNotification(id: string, address: string): Promise<any> {
    const res = await superagent.delete(
      `${BASE_URL}/notification/${id}/${address}`
    );
    return new User(res.body);
  }

  static async getUserFromSides(sides: Side[]): Promise<any> {
    const res = await superagent
      .post(`${BASE_URL}/user/side`)
      .send({ sides: sides });
    return res.body.users;
  }

  static async sendInvitation(invitation: Invitation): Promise<any> {
    const res = await superagent
      .post(`${BASE_URL}/invitation`)
      .send(invitation);
    return res.body;
  }

  static async sendMultipleInvitations(
    invitations: Invitation[]
  ): Promise<any> {
    const res = await superagent
      .post(`${BASE_URL}/invitation/many`)
      .send(invitations);
    return res.body;
  }

  static async sendSingleInvitation(invitation: any): Promise<any> {
    const res = await superagent
      .post(`${BASE_URL}/invitation`)
      .send(invitation);
    return res.body;
  }

  static async getInvitationFromLink(id: string): Promise<any> {
    const res = await superagent
      .get(`${BASE_URL}/invitation/invitationLink/:${id}`)
    return res.body;
  }

  static async sendRequestPrivateSide(data: any): Promise<any> {
    const res = await superagent
      .post(`${BASE_URL}/invitation/request`)
      .send(data);
    return res.body;
  }

  static async getRequestsFromInvitations(
    userId: string,
    sideId: string
  ): Promise<any> {
    const res = await superagent.get(
      `${BASE_URL}/invitation/${sideId}/${userId}`
    );
    return res.body;
  }

  static async updateInvitationState(id: string, state: number): Promise<any> {
    const res = await superagent
      .patch(`${BASE_URL}/invitation/${id}`)
      .send({ state: state });
    return res.body;
  }

  static async getPendingInvitationsByRecipient(
    id: string
  ): Promise<Invitation[]> {
    const res = await superagent.get(
      `${BASE_URL}/invitation/pending/recipient/${id}`
    );
    return res.body;
  }

  static async acceptInvitation(invitation: any): Promise<any> {
    const res = await superagent
      .post(`${BASE_URL}/invitation/accepted`)
      .send(invitation);
    return res.body;
  }

  static async acceptRequest(invitation: any): Promise<any> {
    const res = await superagent
      .post(`${BASE_URL}/invitation/request/accepted`)
      .send(invitation);
    return res.body;
  }

  static async getUsersByIds(ids: string[]): Promise<any> {
    const res = await superagent
      .post(`${BASE_URL}/user/ids`)
      .send({ ids: ids });
    return res.body;
  }

  static async updateSubAdmin(name: string, sideId: string): Promise<any> {
    const res = await superagent
      .post(`${BASE_URL}/user/subadmin`)
      .send({ sideId: sideId, name: name });
    return res.body;
  }

  static async leaveSide(profile: Profile): Promise<any> {
    const res = await superagent
      .post(`${BASE_URL}/profile/leave`)
      .send({ id: profile.id, sideId: profile.side.id, role: profile.role });
    return res.body;
  }

  static async removeProfile(id: string): Promise<any> {
    const res = await superagent.delete(`${BASE_URL}/profile/${id}`);
    return res.body;
  }

  static async savedCollections(collections: Collection[]) {
    const copy = _.cloneDeep(collections);

    const data = copy.map((c: any) => {
      c.opensea = JSON.stringify(c.opensea);
      return c;
    });
    const res = await superagent
      .post(`${BASE_URL}/collection/many`)
      .send({ collections: data });
    return res;
  }

  static async savedMetadataConditions(metadata: Metadata[]) {
    const res = await superagent
      .post(`${BASE_URL}/metadata/many`)
      .send({ metadata: metadata });
    return res;
  }

  static async getAllCollections(): Promise<Collection[]> {
    const res = await superagent.get(`${BASE_URL}/collection`);
    return res.body;
  }

  static async getCollectionByAddress(address: string): Promise<Collection> {
    const res = await superagent.get(`${BASE_URL}/collection/${address}`);
    return new Collection(res.body);
  }
  static async getManyCollectionsByAddress(
    addresses: string[]
  ): Promise<Collection[]> {
    const res = await superagent
      .get(`${BASE_URL}/collection/getMany`)
      .query({ addresses });
    return res.body.map((b: any) => new Collection(b));
  }
}

export { apiService };
