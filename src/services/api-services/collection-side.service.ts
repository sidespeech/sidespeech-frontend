import { BASE_URL } from "../../constants/constants";
import { BaseApiService } from "./base-api.service";

// Create an API Service class
let instance: CollectionSideService;
class CollectionSideService extends BaseApiService {
  static getInstance() {
    if (!instance) instance = new CollectionSideService();
    return instance;
  }

  async saveCollectionSide(data: any[]) {
    const res = await this.post(`${BASE_URL}/collection-side/many`).send({
      data: data,
    });
    return res;
  }
}

export default CollectionSideService.getInstance();
