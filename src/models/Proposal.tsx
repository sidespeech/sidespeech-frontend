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
  public categoryProposal?: CategoryProposal;
  public safe?: GnosisSafe;
  public details: Object;

  constructor(_data: any) {
    this.id = _data.id;
    this.status = _data.status;
    this.categoryId = _data.categoryId;
    this.safeId = _data.safeId;
    this.categoryProposal = _data.categoryProposal;
    this.safe = _data.safe;
    this.details = _data.details;
  }
}
