import { BASE_URL } from "../../constants/constants";
import { Proposal } from "../../models/Proposal";
import { BaseApiService } from "./base-api.service";

// Create an API Service class
let instance: ProposalService;
class ProposalService extends BaseApiService {

  static getInstance() {
    if (!instance) instance = new ProposalService();
    return instance;
  }

  async getProposalsBySafeId(safeId:string) {
    const res = await this.get(`${BASE_URL}/proposal/safe/${safeId}`);
    return res['body'].map((prop:any) => new Proposal(prop));
  }

  async getActiveProposalsBySafeId(safeId:string) {
    const res = await this.get(`${BASE_URL}/proposal/active/safe/${safeId}`);
    return new Proposal(res['body']);
  }

  async saveProposal(proposal:Proposal) {
    const res = await this.post(`${BASE_URL}/proposal/${proposal['safeId']}`).send(proposal);
    return new Proposal(res['body']);
  }


}

export default ProposalService.getInstance();
