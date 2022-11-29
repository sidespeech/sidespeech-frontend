import { BASE_URL } from "../../constants/constants";
import { Metadata } from "../../models/Metadata";
import { BaseApiService } from "./base-api.service";


// Create an API Service class
let instance: AnnouncementService;
class AnnouncementService extends BaseApiService {

  static getInstance() {
    if (!instance) instance = new AnnouncementService();
    return instance;
  }

  async savedMetadataConditions(metadata: Metadata[]) {
    const res = await this.post(`${BASE_URL}/metadata/many`).send({
      metadata: metadata,
    });
    return res;
  }


}

export default AnnouncementService.getInstance();
