import { BASE_URL } from "../../constants/constants";
import { Announcement } from "../../models/Announcement";
import { BaseApiService } from "./base-api.service";

// Create an API Service class
let instance: AnnouncementService;
class AnnouncementService extends BaseApiService {

  static getInstance() {
    if (!instance) instance = new AnnouncementService();
    return instance;
  }

    // This method will create an announcement call to the API
    async createAnnouncement(
        announcement: any,
        creatorAddress: any,
        channelId: string
      ): Promise<Announcement> {
        const createAnnouncement = await this.post(`${BASE_URL}/announcement`)
          .send({
            content: announcement,
            creatorAddress: creatorAddress,
            channelId,
            timestamp: Date.now().toString(),
          })
          .set("accept", "json");
    
        return new Announcement(createAnnouncement.body);
      }
    
      // Get all the announcements
      async getAnnouncements(): Promise<any> {
        const res = await this.get(`${BASE_URL}/announcement`);
        return res.body.map((a: any) => new Announcement(a));
      }

}

export default AnnouncementService.getInstance();
