import { NFT } from "./interfaces/nft";
import { Profile } from "./Profile";

export class User {
  id: string;
  username: string;
  bio: string;
  accounts: string;
  publicNfts: NFT[] = [];
  ownedNfts: NFT[];
  profiles: Profile[];
  token: string;
  invitations: any[];
  userAvatar: NFT | null;

  constructor(_data: any) {
    this.id = _data.id;
    this.username = _data.username;
    this.bio = _data.bio;
    this.accounts = _data.accounts;
    this.publicNfts = _data.publicNfts ? JSON.parse(_data.publicNfts) : [];
    this.profiles = _data.profiles
      ? _data.profiles.map((p: any) => new Profile(p))
      : [];
    this.token = _data.token;
    this.invitations = _data.invitations;
    this.ownedNfts = _data.ownedNfts ? JSON.parse(_data.ownedNfts) : [];
    this.userAvatar = _data.userAvatar ? JSON.parse(_data.userAvatar) : null;
  }
}
