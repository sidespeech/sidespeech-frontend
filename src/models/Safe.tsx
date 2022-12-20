import { Side } from "./Side";

export class Safe {
  public id?: string;
  public contractAddress: string;
  public threshold: number;
  public sideId: string;
  public profileId?: string;

  constructor(_data: any) {
    this.id = _data.id;
    this.contractAddress = _data.contractAddress;
    this.threshold = _data.threshold;
    this.sideId = _data.sideId;
    this.profileId = _data.profileId;
  }
}
