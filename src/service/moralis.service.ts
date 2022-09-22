import _ from "lodash";
import Moralis from "moralis";
import { useNewMoralisObject, useTokenPrice } from "react-moralis";
import { NATIVES_TOKENS_ADDRESS } from "../constants/constants";
import { Channel, Colony } from "../models/Colony";
import { Erc20Token, UserTokensData } from "../models/UserTokensData";

export interface IColony {
  objectId: string;
  name: string;
  creatorAddress: string; // user?.attributes.ethAddress
  isCreatorOwner: boolean;
  websiteLink: string;
  // profileUrl: string;
  // backgroundUrl: string;
  membersId: string[];
  channelsId: string[];
  moderatorsId: string[];
}

export interface IChannel {
  objectId: string;
  name: string;
  isVisible: boolean;
  type: "announcement" | "sondage";
  contentsId: string[];
}

export interface Poll {
  objectId: string;
  question: string;
  answers: string[];
}

class MoralisService {
  private static instance: MoralisService;

  private constructor() {}

  public static getInstance(): MoralisService {
    if (!MoralisService.instance) {
      MoralisService.instance = new MoralisService();
    }

    let serverUrl = "https://nyntqrq0zh4z.usemoralis.com:2053/server";
    let appId = "UUQ8TnQNeOid3DJ5blkab3Jv2K9nsXDpFTasNs3f";
    (async function startMoralis() {
      await Moralis.start({ serverUrl, appId });
    })();

    return MoralisService.instance;
  }
  public async createColony(
    formData: any,
    image: Moralis.File | null,
    cover: Moralis.File | null
  ): Promise<Colony> {
    var user = Moralis.User.current();
    const channel1 = this.createChannel("Announcement", "announcement", true);
    const channel2 = this.createChannel("DAO", "sondage");
    const channel3 = this.createChannel("DAO proposal", "sondage");

    const newColony = new Moralis.Object("Colony");
    newColony.set("name", formData.colonyName);
    newColony.set("nftTokenAddress", formData.colonyTokenAddress);
    newColony.set("WebsiteUrl", formData.colonyWebsiteLink);
    newColony.set("image", image);
    newColony.set("cover", cover);
    newColony.set("CreatorAddress", user?.attributes.ethAddress);

    const colony = await newColony.save({
      channels: [channel1, channel2, channel3],
    });
    const createdColony = new Colony(colony);
    const profile = await this.createProfile(
      "Owner",
      createdColony,
      "Administrator"
    );
    user?.relation("profiles").add(profile);
    user?.save();
    colony.relation("members").add(profile);
    colony.save();
    return createdColony;
  }

  public async getColonyDatas(colonyId: string): Promise<Colony> {
    var query = new Moralis.Query("Colony");
    query.equalTo("objectId", colonyId);
    var object = await query.find();
    var colony = new Colony(object[0]);
    await colony.getMembers();
    var query2 = new Moralis.Query("Channel");
    var channels = await query2.filter((c) => colony.channelsId.includes(c.id));
    const results = await Promise.all(
      channels.map(async (c) => {
        const chan = new Channel(c);
        await chan.getAnnouncements(c.attributes.announcements);
        await chan.getPolls(c.attributes.polls);
        return chan;
      })
    );
    colony.channels = results;
    return colony;
  }

  public async createProfile(
    username: string,
    colony: Colony,
    role: string
  ): Promise<any> {
    const user = Moralis.User.current();
    const query = new Moralis.Query("Role");
    query.equalTo("name", role);
    const r = await query.first();
    const profile = new Moralis.Object("Profile");
    profile.set("username", username);
    profile.set("user", user?.toPointer());
    profile.set("colony", colony.moralisColony.toPointer());
    profile.set("role", r?.toPointer());

    return await profile.save();
  }

  public async sendUserVote(pollId: string, answer: number): Promise<any> {
    const user = Moralis.User.current();
    const vote = new Moralis.Object("UserVote");
    const query = new Moralis.Query("Poll");
    query.equalTo("objectId", pollId);
    const poll = await query.first();
    vote.set("user", user?.toPointer());
    vote.set("poll", poll?.toPointer());
    vote.set("selectedAnswer", answer);
    const v = await vote.save();
    poll?.relation("votes").add(v);
    const newPoll = await poll?.save();
    return newPoll;
  }

  public async getColonies(): Promise<Colony[]> {
    const query = new Moralis.Query("Colony");
    const res = await query.find();
    const colonies = res.map((r) => new Colony(r));
    return colonies;
  }
  public async JoinColony(colony: Colony, username: string): Promise<boolean> {
    const profile = await this.createProfile(username, colony, "User");
    const user = Moralis.User.current();
    user?.relation("profiles").add(profile);
    colony.moralisColony.relation("members").add(profile);
    await user?.save();
    await colony.moralisColony.save();
    return true;
  }
  public async updateChannel(
    channelId: string,
    value: boolean
  ): Promise<Channel | null> {
    const query = new Moralis.Query("Channel");
    query.equalTo("objectId", channelId);
    const channelToUpdate = await query.first();
    let channel = null;
    if (channelToUpdate) {
      channel = await channelToUpdate?.save({ isVisible: value });
    }
    const newChannel = new Channel(channel);
    newChannel.getAnnouncements(channel?.attributes.announcements);
    newChannel.getPolls(channel?.attributes.polls);
    return newChannel;
  }
  public async sendAnnonce(channelId: string, annonce: string) {
    const user = Moralis.User.current();
    const announcement = new Moralis.Object("Announcement");
    announcement.set("content", annonce);
    announcement.set("creator", user?.toPointer());
    announcement.set("Comments", []);
    const a = await announcement.save();
    const query = new Moralis.Query("Channel");
    query.equalTo("objectId", channelId);
    const channel = await query.first();
    channel?.relation("announcements").add(a);
    await channel?.save();
  }
  public async sendComment(announceId: string, comment: string) {
    const user = Moralis.User.current();
    const newComment = new Moralis.Object("Comment");
    newComment.set("content", comment);
    newComment.set("creator", user?.toPointer());
    const com = await newComment.save();
    var query = new Moralis.Query("Announcement");
    query.equalTo("objectId", announceId);
    const announcement = await query.first();
    announcement?.relation("comments").add(com);
    await announcement?.save();
  }
  public async updateModerators(colonyId: string, moderatorIds: string[]) {
    await Moralis.Cloud.run("updateModerators", { colonyId, moderatorIds });
  }

  public async getUserColonies(address: string): Promise<Colony[]> {
    const user = Moralis.User.current();
    const colonies: Colony[] = [];
    const profiles = await user
      ?.relation("profiles")
      .query()
      .include("colony")
      .find();
    console.log(profiles);
    if (profiles) {
      profiles.forEach((p) => {
        colonies.push(new Colony(p.get("colony")));
      });
    }
    console.log(colonies);
    return colonies;
  }

  private createChannel(
    name: string,
    type: string,
    isVisible: boolean = false
  ) {
    const newChannel = new Moralis.Object("Channel");
    newChannel.set("name", name);
    newChannel.set("type", type);
    newChannel.set("isVisible", isVisible);
    return newChannel;
  }

  public async proposePoll(
    question: string,
    answers: string[],
    isProposed: boolean = true,
    channel: Channel
  ) {
    const user = Moralis.User.current();
    const newPoll = new Moralis.Object("Poll");
    newPoll.set("question", question);
    newPoll.set("answers", answers);
    newPoll.set("isProposed", isProposed);
    newPoll.set("creator", user?.toPointer());
    const savedPoll = await newPoll.save();
    const query = new Moralis.Query("Channel");
    query.equalTo("objectId", channel.id);
    var res = await query.first();
    res?.relation("polls").add(savedPoll);
    const newChannel = await res?.save();
    const chan = new Channel(newChannel);
    chan.getPolls(newChannel?.attributes.polls);
    chan.getAnnouncements(newChannel?.attributes.announcements);
    return chan;
  }

  /**
   * @description Get all the nfts (ERC721 and ERC1155) for the given address. Grouped by collection name and contract type.
   * @param address address of the owner
   * @returns an object of ERC721 and ERC1155 NFTS grouped by name
   */
  public async getNftsOwnedByAddress(address: string): Promise<UserTokensData> {
    let allResults: any[] = [];
    let hasCursor: boolean = true;
    let response;
    let cursor = undefined;
    while (hasCursor) {
      response = await Moralis.Web3API.account.getNFTs({
        address,
        chain: "eth",
        cursor: cursor,
      });
      hasCursor = response.cursor !== null;
      cursor = response.cursor;
      allResults = allResults.concat(response.result);
    }
    if (allResults.length > 0 && response) {
      allResults = await this.getMissingMetadata(allResults);

      const userTokens = new UserTokensData(response.total || 0, allResults);
      return userTokens;
    }
    return new UserTokensData(0, []);
  }
  /**
   * @description get token balances of given address with metadata
   * @param address address of the user to get token balances
   * @returns array of erc20 tokens with metadata and user balance
   */
  public async getUserTokens(address: string) {
    const response = await Moralis.Web3API.account.getTokenBalances({
      address,
      chain: "eth",
    });

    const tokensERC20: Erc20Token[] = [];
    for (let index = 0; index < response.length; index++) {
      const element = response[index];
      tokensERC20.push(new Erc20Token(element));
    }
    tokensERC20.push(await this.getNativeTokenBalanceAndData(address));
    return tokensERC20;
  }
  /**
   * @description Get an array of nfts datas and add missing metadata if needed
   * @param datas array of nfts datas
   * @returns Array of nfts data with missing metadata
   */
  private async getMissingMetadata(datas: any[]): Promise<any[]> {
    datas.forEach(async (element) => {
      if (element.token_uri && element.metadata === null) {
        try {
          // const data = await fetch(element.token_uri);
          // element.metadata = JSON.stringify(data);
        } catch (error: any) {}
      }
    });
    return datas;
  }
  /**
   * @description Get metadata about native token and the user balance
   * @param address user address
   * @returns Erc20TokenData containing all information about the token
   */
  private async getNativeTokenBalanceAndData(
    address: string
  ): Promise<Erc20Token> {
    const ethtokenData = await Moralis.Web3API.token.getTokenMetadata({
      chain: "eth",
      addresses: [NATIVES_TOKENS_ADDRESS.ETH],
    });
    const ethBalance = await Moralis.Web3API.account.getNativeBalance({
      chain: "eth",
      address,
    });
    const data = {
      token_address: ethtokenData[0].address,
      name: ethtokenData[0].name,
      symbol: ethtokenData[0].symbol,
      decimals: ethtokenData[0].decimals,
      balance: ethBalance.balance,
      logo: ethtokenData[0].logo,
      thumbnail: ethtokenData[0].thumbnail,
    };
    return new Erc20Token(data);
  }

  /**
   * @description save file in IPFS using Moralis
   * @param file file to save
   * @returns the Moralis saved file
   */
  public async saveFile(file: File): Promise<Moralis.File> {
    const moralisFile = new Moralis.File(file.name, file);
    await moralisFile.saveIPFS();
    return moralisFile;
  }
  public async updateMoralisUser({
    profilePicture,
    nfts,
  }: {
    profilePicture: any;
    nfts: any[];
  }): Promise<any> {
    const user = Moralis.User.current();
    user?.set("savedNfts", nfts);
    user?.set("profilePicture", profilePicture);
    const newUser = await user?.save();
    return newUser;
  }
  public async getProfile(colony: Colony): Promise<Moralis.Object<Moralis.Attributes> | undefined> {
    const user = Moralis.User.current();
    const profiles: Moralis.Object<Moralis.Attributes>[] | undefined = await user
      ?.relation("profiles")
      .query()
      .include("colony")
      .find();
    let colonyProfile = profiles?.find((p) => p.get("colony").id === colony.id);
    
    return colonyProfile;
  }
  public async saveUsername(username: string, colony: Colony, profile: any) {
    if (profile) {
      profile.set("username", username);
    } else {
      profile = await this.createProfile(username, colony, "User");
    }
    const updatedProfile = await profile.save();
    return updatedProfile;
  }

  public async changeUserRole(role:string,profile:Moralis.Object<Moralis.Attributes>) {
    const query = new Moralis.Query("Role");
    query.equalTo("name", role);
    const r = await query.first();
    profile.set('role',r?.toPointer());
    await profile.save();
  }

  public async createTextualChannel(name:string,colony: Colony){
    const channel = this.createChannel(name,"textual",true);
    await colony.moralisColony.save({
      channels: [...colony.moralisColony.get("channels"),channel]
    })

    return await this.getColonyDatas(colony.id);
  }

}
export default MoralisService.getInstance();
