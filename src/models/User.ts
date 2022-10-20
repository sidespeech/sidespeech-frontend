import { Profile } from "./Profile";

export class User {
  id: string;

  accounts: string;

  publicNfts: string;
  profiles: Profile[];

  constructor(_data: any) {

    console.log(_data);
    
    this.id = _data.id;
    this.accounts = _data.accounts;
    this.publicNfts = _data.publicNfts;
    this.profiles = _data.profiles ? _data.profiles.map((p: any) => new Profile(p)) : _data.profiles;
  }
}
