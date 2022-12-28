import { BASE_URL } from '../../constants/constants';
import { Message, Room } from '../../models/Room';
import { BaseApiService } from './base-api.service';

// Create an API Service class
let instance: RoomService;
class RoomService extends BaseApiService {
	static getInstance() {
		if (!instance) instance = new RoomService();
		return instance;
	}

	async getRoomByName(name: string): Promise<Room> {
		const res = await this.get(`${BASE_URL}/room`).query({ name });
		return new Room(res.body);
	}

	async getRoomMessages(id: string): Promise<Message[]> {
		const res = await this.get(`${BASE_URL}/room/messages`).query({ id });
		return res.body.map((m: any) => new Message(m));
	}

	async createRoom(id: string, id2: string): Promise<Room> {
		const res = await this.post(`${BASE_URL}/room`).send({
			profileIds: [id, id2]
		});
		return new Room(res.body);
	}
}

export default RoomService.getInstance();
