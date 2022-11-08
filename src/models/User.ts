import { NFT } from "./interfaces/nft";
import { Profile } from "./Profile";

export class User {
  id: string;
  username: string;
  bio: string;
  accounts: string;
  publicNfts: NFT[] | null;
  ownedNfts: NFT[];
  profiles: Profile[];
  token: string;

  constructor(_data: any) {
    this.id = _data.id;
    this.username = _data.username;
    this.bio = _data.bio;
    this.accounts = _data.accounts;
    this.publicNfts = _data.publicNfts ? JSON.parse(_data.publicNfts) : null;
    this.profiles = _data.profiles
      ? _data.profiles.map((p: any) => new Profile(p))
      : _data.profiles;
    this.token = _data.token;
    this.ownedNfts = _data.ownedNfts ? JSON.parse(_data.ownedNfts) : [];
  }
}
