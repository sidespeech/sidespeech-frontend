import { BASE_URL } from '../../constants/constants';
import { Announcement } from '../../models/Announcement';
import { ChannelType, Channel } from '../../models/Channel';
import { Poll } from '../../models/Poll';
import { BaseApiService } from './base-api.service';

// Create an API Service class
let instance: ChannelService;
class ChannelService extends BaseApiService {
	static getInstance() {
		if (!instance) instance = new ChannelService();
		return instance;
	}

	async getChannelAnnouncements(id: string): Promise<Announcement[]> {
		const res = await this.get(`${BASE_URL}/channel/announcements`).query({
			id
		});
		return res.body.map((m: any) => new Announcement(m));
	}

	async createChannel(sideId: string, name: string, type: ChannelType): Promise<Channel> {
		const res = await this.post(`${BASE_URL}/channel`).send({
			sideId,
			name,
			type,
			isVisible: true
		});
		return new Channel(res.body);
	}

	async createManyChannels(channels: any[]): Promise<any> {
		const res = await this.post(`${BASE_URL}/channel/many`).send(channels);
		return res.body.map((c: any) => new Channel(c));
	}

	async updateManyChannels(channels: Channel[]): Promise<any> {
		const res = await this.patch(`${BASE_URL}/channel/many`).send(channels);
		return res.body.map((c: any) => new Channel(c));
	}
	async removeChannels(ids: string | string[]): Promise<any> {
		const res = await this.delete(`${BASE_URL}/channel/many`).send({
			ids: ids
		});
		return res.body;
	}

	async getChannelPolls(channelId: string): Promise<Poll[]> {
		const res = await this.get(`${BASE_URL}/channel/${channelId}/polls`);
		return res.body.map((m: any) => new Poll(m));
	}
}

export default ChannelService.getInstance();
