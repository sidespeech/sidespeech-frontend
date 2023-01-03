import { Proposal } from "./Proposal";


export enum TxStatus {
	Failed,
	Success,
}

export class Transaction {
  public id?: string;
  public txHash: string;
  public status: TxStatus;
  public blockNumber: number;
  public chainId: number
  public from: string;
  public to: string;
  public gasFee: string;
  public value: string;
  public data: string;
  public nonce: number;
  public r: string;
  public s: string;
  public transactionIndex: number;
  public proposalId?: string;
  public proposal?: Proposal;


  constructor(_data: any) {
    this.id = _data.id;
    this.txHash = _data.txHash;
    this.chainId = _data.chainId;
    this.status = _data.status;
    this.blockNumber = _data.blockNumber;
    this.from = _data.from;
    this.to = _data.to;
    this.gasFee = _data.gasFee;
    this.value = _data.value;
    this.data = _data.data;
    this.nonce = _data.nonce;
    this.r = _data.r;
    this.s = _data.s;
    this.transactionIndex = _data.transactionIndex;
    this.proposalId = _data.proposalId;
    this.proposal = _data.proposal;
  }
}
