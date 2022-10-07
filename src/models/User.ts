import { Profile } from "./Profile";

export class User {
  id: string;

  accounts: string;

  publicNfts: string;
  profiles: Profile[];

  constructor(_data: any) {
    this.id = _data.id;
    this.accounts = _data.accounts;
    this.publicNfts = _data.publicNfts;
    this.profiles = _data.profiles;
  }
}
