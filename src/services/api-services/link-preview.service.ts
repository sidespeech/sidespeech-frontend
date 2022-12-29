import { BASE_URL } from '../../constants/constants';
import { LinkPreview } from '../../models/LinkPreview';
import { BaseApiService } from './base-api.service';

// Create an API Service class
let instance: LinkPreviewService;
class LinkPreviewService extends BaseApiService {
	static getInstance() {
		if (!instance) instance = new LinkPreviewService();
		return instance;
	}

	async getLinkMetadata(url: string): Promise<LinkPreview> {
		const res = await this.get(`${BASE_URL}/link-preview`).query({
			url
		});
		return new LinkPreview(res.body);
	}
}

export default LinkPreviewService.getInstance();
