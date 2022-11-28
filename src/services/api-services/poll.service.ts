import { BASE_URL } from "../../constants/constants";
import { Poll } from "../../models/Poll";
import { BaseApiService } from "./base-api.service";

// Create an API Service class
let instance: PollService;
class PollService extends BaseApiService {

  static getInstance() {
    if (!instance) instance = new PollService();
    return instance;
  }

  async createPoll(
    channelId: string,
    creatorId: string,
    proposalTitle: string,
    endDate: string,
    question: string,
    isProposed: boolean,
    options: any,
    timestamp: string
  ): Promise<Poll> {
    const res = await this.post(`${BASE_URL}/poll`).send({
      channelId,
      creatorId,
      proposalTitle,
      endDate,
      question,
      isProposed,
      options,
      timestamp,
    });
    return new Poll(res.body);
  }

  async commentPoll(
    comment: any,
    creatorAddress: any,
    pollId: string
  ): Promise<any> {
    const sendComment = await this.post(`${BASE_URL}/poll/${pollId}/comment`)
      .send({
        content: comment,
        creatorAddress: creatorAddress,
        timestamp: Date.now().toString(),
      })
      .set("accept", "json");

    return new Comment(sendComment.body);
  }
}

export default PollService.getInstance();
