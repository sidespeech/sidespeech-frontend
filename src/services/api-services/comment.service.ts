import { BASE_URL } from "../../constants/constants";
import { Comment } from "../../models/Comment";
import { BaseApiService } from "./base-api.service";

// Create an API Service class
let instance: CommentService;
class CommentService extends BaseApiService {

  static getInstance() {
    if (!instance) instance = new CommentService();
    return instance;
  }

  // Grab all the comments.
  async getComents(): Promise<any> {
    const res = await this.get(`${BASE_URL}/comments`);
    return res.body.map((c: any) => new Comment(c));
  }
  async getCommentByAnnoucementId(id: string): Promise<Comment[]> {
    const res = await this.get(`${BASE_URL}/comment/announcement/${id}`);
    return res.body.map((m: any) => new Comment(m));
  }

  async sendComment(
    comment: any,
    creatorAddress: any,
    announcementId: string
  ): Promise<any> {
    const sendComment = await this.post(`${BASE_URL}/comment`)
      .send({
        content: comment,
        creatorAddress: creatorAddress,
        announcementId: announcementId,
        timestamp: Date.now().toString(),
      })
      .set("accept", "json");

    return new Comment(sendComment.body);
  }
}

export default CommentService.getInstance() as CommentService;
