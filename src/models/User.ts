import { Profile } from "./Profile";

export class User {
  id: string;

  accounts: string;

  publicNfts: string;
  profiles: Profile[];
  nonce: number;

  constructor(_data: any) {
    this.id = _data.id;
    this.accounts = _data.accounts;
    this.nonce = _data.nonce;
    this.publicNfts = _data.publicNfts;
    this.profiles = _data.profiles.map((p: any) => new Profile(p));
  }
}
