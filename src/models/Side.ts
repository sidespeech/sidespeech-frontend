import { Channel } from "./Channel";
import { collectionSides } from "./CollectionSides";
import { MetadataSides } from "./MetadataSides";
import { Profile } from "./Profile";

export enum SideStatus {
  active,
  inactive,
}

export class Side {
  id: string;
  name: string;
  creatorAddress: string;
  description: string;
  eligible: boolean;
  isCreatorOwner: boolean;
  joined: boolean;
  NftTokenAddress: string;
  coverImage: string;
  sideImage: string;
  priv: boolean;
  private?: boolean;
  status: SideStatus;
  firstCollection: any;
  collectionsCount: number;
  // this will be a json containing an object with the token related to a condition as key and
  // his value will be the property key and the property value related to this collection
  conditions: any;
  channels: Channel[];
  profiles: Profile[];
  invitations: any[];
  collections: any[];
  metadataSides: MetadataSides[];
  collectionSides: collectionSides[];
  required: boolean;

  constructor(_data: any) {
    this.channels = _data.channels;
    this.collections = _data.collections;
    this.collectionsCount = 0;
    // this.conditions = _data.conditions ? (_data.conditions instanceof String ? JSON.parse(_data.conditions) : _data.conditions) : {};
    this.conditions = _data.conditions
      ? typeof _data.conditions === "string"
        ? JSON.parse(_data.conditions)
        : _data.conditions
      : {};
    this.status = _data.status;
    this.coverImage = _data.coverImage;
    this.creatorAddress = _data.creatorAddress;
    this.description = _data.description;
    this.eligible = false;
    this.firstCollection = {};
    this.id = _data.id;
    this.invitations = _data.invitations;
    this.isCreatorOwner = _data.isCreatorOwner;
    this.joined = false;
    this.name = _data.name;
    this.NftTokenAddress = _data.NftTokenAddress;
    this.profiles = _data.profiles
      ? _data.profiles.map((p: any) => new Profile(p))
      : [];
    this.priv = _data.private;
    this.private = _data.private;
    this.sideImage = _data.sideImage;
    this.metadataSides = _data.metadataSides;
    this.collectionSides = _data.collectionSides;
    this.required = _data.required;
  }
}
