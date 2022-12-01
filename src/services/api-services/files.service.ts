import { BASE_URL } from '../../constants/constants';
import { BaseApiService } from './base-api.service';

// Create an API Service class
let instance: FilesService;
class FilesService extends BaseApiService {
    static getInstance() {
        if (!instance) instance = new FilesService();
        return instance;
    }

    async uploadImage(image: FormData): Promise<string> {
        const res = await this.post(`${BASE_URL}/file`).send(image);
        return res.text || '';
    }
}

export default FilesService.getInstance();
