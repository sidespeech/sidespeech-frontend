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

  async saveProposal(proposal:Proposal) {
    const res = await this.post(`${BASE_URL}/proposal/${proposal['safeId']}`).send(proposal);
    return new Proposal(res['body']);
  }


}

export default ProposalService.getInstance();
