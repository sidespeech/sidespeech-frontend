import { CategoryProposal } from "./CategoryProposal";
import { GnosisSafe } from "./GnosisSafe";


export enum Status {
  Pending,
  Open, 
  Successful,
  Failed,
  Closed,
  NoFund,
  Queue,
}

export class Proposal {
  public id?: string;
  public status: Status;
  public categoryId?: string;
  public safeId?: string;
  public category?: CategoryProposal;
  public safe?: GnosisSafe;
  public details: Object;

  constructor(_data: any) {
    this.id = _data.id;
    this.status = _data.status;
    this.categoryId = _data.categoryId;
    this.safeId = _data.safeId;
    this.category = _data.category;
    this.safe = _data.safe;
    this.details = _data.details;
  }
}
