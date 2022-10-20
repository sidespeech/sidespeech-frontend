import { Channel } from "./Channel";
import { Profile } from "./Profile";

export class Side {
  id: string;
  name: string;
  creatorAddress: string;
  description: string;
  isCreatorOwner: boolean;
  websiteUrl: string;
  NftTokenAddress: string;
  coverImage: string;
  sideImage: string;
  // this will be a json containing an object with the token related to a condition as key and
  // his value will be the property key and the property value related to this collection
  conditions: any;
  channels: Channel[];
  profiles: Profile[];

  constructor(_data: any) {
    this.id = _data.id;
    this.name = _data.name;
    this.description = _data.description;
    this.creatorAddress = _data.creatorAddress;
    this.isCreatorOwner = _data.isCreatorOwner;
    this.websiteUrl = _data.websiteUrl;
    this.NftTokenAddress = _data.NftTokenAddress;
    this.coverImage = _data.coverImage;
    this.sideImage = _data.sideImage;
    this.conditions = JSON.parse(_data.conditions);
    this.channels = _data.channels;
    this.profiles = _data.profiles
      ? _data.profiles.map((p: any) => new Profile(p))
      : [];
  }
}
