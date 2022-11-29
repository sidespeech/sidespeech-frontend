import { BASE_URL } from "../../constants/constants";
import { Notification } from "../../models/Notification";
import { User } from "../../models/User";
import { BaseApiService } from "./base-api.service";

// Create an API Service class
let instance: NotificationService;
class NotificationService extends BaseApiService {

  static getInstance() {
    if (!instance) instance = new NotificationService();
    return instance;
  }

  // Fetch notification by channel id and user wallet address
  async getNotification(address: string): Promise<any> {
    const res = await this.get(
      `${BASE_URL}/notification/allNotifications/${address}`
    );
    return res.body.map((c: any) => new Notification(c));
  }

  // remove notification by channel id and user wallet address
  async deleteNotification(id: string, address: string): Promise<any> {
    const res = await this.delete(`${BASE_URL}/notification/${id}/${address}`);
    return new User(res.body);
  }
}

export default NotificationService.getInstance();
