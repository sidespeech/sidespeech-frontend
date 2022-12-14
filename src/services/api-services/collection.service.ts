import { BASE_URL } from '../../constants/constants';
import { sortCollectionByVerifiedCollectionsAndVolume } from '../../helpers/utilities';
import { Collection } from '../../models/interfaces/collection';
import { BaseApiService } from './base-api.service';

// Create an API Service class
let instance: CollectionService;
class CollectionService extends BaseApiService {
	static getInstance() {
		if (!instance) instance = new CollectionService();
		return instance;
	}

	async savedCollections(collections: Collection[]) {
		const res = await this.post(`${BASE_URL}/collection/many`).send({
			collections: collections
		});
		return res;
	}

	async updateCollectionTraits(traits: any, address: string): Promise<any> {
		const res = await this.patch(`${BASE_URL}/collection/traits`).send({
			address,
			traits
		});
		return res.body;
	}
	async updateCollection(collection: any): Promise<any> {
		const res = await this.patch(`${BASE_URL}/collection/${collection.address}`).send(collection);
		return res.body ? new Collection(res.body) : collection;
	}

	async getAllCollections(userCollectionsData = {}): Promise<Collection[]> {
		const res = await this.get(`${BASE_URL}/collection`);
		const collections: Collection[] = res.body.map((b: any) => {
			if (b.address in userCollectionsData) b.ownedCount = 1;
			return new Collection(b);
		});
		return collections.sort(sortCollectionByVerifiedCollectionsAndVolume);
	}

	async getCollectionByAddress(address: string): Promise<Collection> {
		const res = await this.get(`${BASE_URL}/collection/${address}`);
		return new Collection(res.body);
	}
	async getManyCollectionsByAddress(addresses: string[]): Promise<Collection[]> {
		const res = await this.get(`${BASE_URL}/collection/getMany`).query({
			addresses
		});
		return res.body.map((b: any) => new Collection(b));
	}
}
export default CollectionService.getInstance();
