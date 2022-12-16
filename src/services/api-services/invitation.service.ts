import { BASE_URL } from '../../constants/constants';
import { Invitation } from '../../models/Invitation';
import { BaseApiService } from './base-api.service';

// Create an API Service class
let instance: InvitationService;
class InvitationService extends BaseApiService {
	static getInstance() {
		if (!instance) instance = new InvitationService();
		return instance;
	}

	async sendInvitation(invitation: Invitation): Promise<any> {
		const res = await this.post(`${BASE_URL}/invitation`).send(invitation);
		return res.body;
	}

	async sendMultipleInvitations(invitations: Invitation[]): Promise<any> {
		const res = await this.post(`${BASE_URL}/invitation/many`).send(invitations);
		return res.body;
	}

	async sendSingleInvitation(invitation: any): Promise<any> {
		const res = await this.post(`${BASE_URL}/invitation`).send(invitation);
		return res.body;
	}

	async getInvitationFromLink(id: string): Promise<any> {
		const res = await this.get(`${BASE_URL}/invitation/invitationLink/:${id}`);
		return res.body;
	}

	async sendRequestPrivateSide(data: any): Promise<any> {
		const res = await this.post(`${BASE_URL}/invitation/request`).send(data);
		return res.body;
	}

	async getRequestsFromInvitations(userId: string, sideId: string): Promise<any> {
		const res = await this.get(`${BASE_URL}/invitation/${sideId}/${userId}`);
		return res.body;
	}

	async updateInvitationState(id: string, state: number): Promise<any> {
		const res = await this.patch(`${BASE_URL}/invitation/${id}`).send({
			state: state
		});
		return res.body;
	}

	async getPendingInvitationsByRecipient(id: string): Promise<Invitation[]> {
		const res = await this.get(`${BASE_URL}/invitation/pending/recipient/${id}`);
		return dtoToInvitationList(res.body);
	}

	async acceptInvitation(invitation: any): Promise<any> {
		const res = await this.post(`${BASE_URL}/invitation/accepted`).send(invitation);
		return res.body;
	}

	async acceptRequest(invitation: any): Promise<any> {
		const res = await this.post(`${BASE_URL}/invitation/request/accepted`).send(invitation);
		return res.body;
	}
}

export default InvitationService.getInstance();

function dtoToInvitation(invitation: any) {
	return new Invitation(invitation);
}

function dtoToInvitationList(invitations: any[]) {
	return invitations.map(i => dtoToInvitation(i));
}
