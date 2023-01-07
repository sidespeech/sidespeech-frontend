import { CategoryProposal } from './CategoryProposal';
import { GnosisSafe } from './GnosisSafe';
import { NFT } from './interfaces/nft';

export enum Status {
	Pending,
	Open,
	Successful,
	Failed,
	Closed,
	NoFund,
	Queue
}

export class Proposal {
	public id?: string;
	public status: Status;
	public categoryId?: string;
	public safeId?: string;
	public category?: CategoryProposal;
	public safe?: GnosisSafe;
	public details: any;
	index?: number;
	profileIds?: string[];

	constructor(_data: any) {
		this.id = _data.id;
		this.status = _data.status;
		this.categoryId = _data.categoryId;
		this.safeId = _data.safeId;
		this.category = _data.category;
		this.safe = _data.safe;
		this.details = _data.details;
		this.profileIds = _data.profileIds ? _data.profileIds : [];
	}

	isActive() {
		return this.status === Status.Pending || this.status === Status.Open || this.status === Status.Queue;
	}
}

interface ProposalDetailsCustomPoll {
	title: string;
	endDate: string;
	question: string;
	answers: string[];
}
interface ProposalDetailsListForSale {
	description: string;
	endDate: string;
	nft: NFT;
	price: number;
}
interface ProposalDetailsToDelist {
	description: string;
	endDate: string;
	nft: NFT;
}
interface ProposalDetailsPayout {
	description: string;
	endDate: string;
}
interface ProposalDetailsFundsTransfert {
	description: string;
	endDate: string;
	recipient: string;
}
interface ProposalDetailsOpenFundingRound {
	description: string;
	endDate: string;
	targetAmount: number;
}
interface ProposalDetailsCloseFundingRound {
	ids: string[];
}
