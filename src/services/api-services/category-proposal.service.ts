import { BASE_URL } from "../../constants/constants";
import { CategoryProposal } from "../../models/CategoryProposal";
import { BaseApiService } from "./base-api.service";

// Create an API Service class
let instance: CategoryProposalService;
class CategoryProposalService extends BaseApiService {

  static getInstance() {
    if (!instance) instance = new CategoryProposalService();
    return instance;
  }

  async getAllCategories() {
    const res = await this.get(`${BASE_URL}/category-proposal`);
    return res['body'].map((category:any) => new CategoryProposal(category));
  }


}

export default CategoryProposalService.getInstance();
