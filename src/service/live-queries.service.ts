import Moralis from "moralis";
import { trigger } from "../helpers/CustomEvent";
import { Announcement, Channel, Colony } from "../models/Colony";

let instance: LiveQueriesService;
class LiveQueriesService {
  public colonySubscribe: Moralis.LiveQuerySubscription | null = null;

  static getInstance() {
    if (!instance) instance = new LiveQueriesService();
    return instance;
  }

  async subscribeChannels(colonies: Colony[]) {
    const flattenChannels = colonies.map((c) => c.channelsId).flat();

    if (this.colonySubscribe === null && flattenChannels.length > 0) {
      let query = new Moralis.Query("Channel");
      query.containedIn("objectId", flattenChannels);
      console.log("query", await query.find());
      this.colonySubscribe = await query.subscribe();
      this.colonySubscribe.on("update", async (object) => {
        const newChannel = new Channel(object);
        await newChannel.getAnnouncements(object.attributes.announcements);
        await newChannel.getPolls(object.attributes.polls);
        trigger("channelUpdate", newChannel);
      });
    }
  }
  async unSubscribeChannels() {
    this.colonySubscribe?.unsubscribe();
    this.colonySubscribe = null;
  }
  async subscribeComment(announcement: Announcement) {
    let query = new Moralis.Query("Announcement");
    query.equalTo("objectId", announcement.id);
    this.colonySubscribe = await query.subscribe();
  }
}
export default LiveQueriesService.getInstance();
