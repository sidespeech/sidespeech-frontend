import { BASE_URL } from "../../constants/constants";
import { Vote } from "../../models/Vote";
import { BaseApiService } from "./base-api.service";

// Create an API Service class
let instance: VoteService;
class VoteService extends BaseApiService {
  // Methodthat will manage sending the wallet connection.

  static getInstance() {
    if (!instance) instance = new VoteService();
    return instance;
  }

  
  async voteOnPoll(
    voterId: string,
    option_id: string,
    timestamp: string,
    signature: string,
    contractAddresses: string[]
  ): Promise<Vote> {
    const res = await this.post(`${BASE_URL}/vote`).send({
      voterId,
      option_id,
      timestamp,
      signature,
      contractAddresses,
    });
    return new Vote(res.body);
  }

}

export default VoteService.getInstance();
