import _, { cloneDeep } from 'lodash';
import { InitialStateUpdateSide } from '../../components/CurrentColony/settings/informations/Information';
import { InitialStateSide } from '../../components/NewSide/NewSide';
import { BASE_URL } from '../../constants/constants';
import { checkUserEligibility } from '../../helpers/utilities';
import { Side, SideStatus } from '../../models/Side';
import alchemyService from '../web3-services/alchemy.service';
import { BaseApiService } from './base-api.service';

let instance: SideService;
class SideService extends BaseApiService {
	static getInstance() {
		if (!instance) instance = new SideService();
		return instance;
	}
	// get side by Id
	async getSideById(id: string): Promise<Side> {
		const res = await this.get(`${BASE_URL}/side/${id}`);
		return dtoToSide(res.body);
	}

	// get side by name
	async getSideByName(name: string): Promise<Side> {
		const res = await this.get(`${BASE_URL}/side/byname/${name}`);
		return dtoToSide(res.body);
	}

	// get side by slug
	async getSideBySlug(name: string): Promise<Side> {
		const res = await this.get(`${BASE_URL}/side/byslug/${name}`);
		return dtoToSide(res.body);
	}

	// get all sides without channels
	async getAllSides(userCollectionsData?: any, userSides?: Side[]): Promise<Side[]> {
		const res = await this.get(`${BASE_URL}/side`);
		const sides = dtoToSideList(res['body']);
		const sidesList = await getSidesMetadata(sides, userCollectionsData, userSides);
		return sidesList;
	}

	// get all sides by search string
	async getSidesBySearchValue(
		searchValue: string,
		collections?: string,
		userCollectionsData?: any,
		userSides?: Side[]
	): Promise<Side[]> {
		const res = await this.get(
			`${BASE_URL}/side/search?searchValue=${searchValue}&collections=${
				collections && collections !== 'all' ? collections : ''
			}`
		);
		const sides = dtoToSideList(res['body']);
		const sidesList = await getSidesMetadata(sides, userCollectionsData, userSides);
		return sidesList;
	}

	async getSidesByOwner(address: string, userCollectionsData?: any, userSides?: Side[]): Promise<Side[]> {
		const res = await this.get(`${BASE_URL}/side/owner?address=${address}`);
		const sidesList = await getSidesMetadata(res.body, userCollectionsData, userSides);
		return sidesList;
	}

	// get all featured sides
	async getAllFeaturedSides(userCollectionsData?: any, userSides?: Side[]): Promise<Side[]> {
		const res = await this.get(`${BASE_URL}/side/featured`);
		const sidesList = await getSidesMetadata(res.body, userCollectionsData, userSides);
		return sidesList;
	}

	// get all sides for an array of collections
	async getSidesByCollections(collections: string[]): Promise<{ contracts: string; sides: any[] }> {
		const res = await this.get(`${BASE_URL}/side/collection/sidescount?contracts=${collections?.join(',')}`);
		return res.body;
	}

	async isSideNameExist(name: string): Promise<boolean> {
		const res = await this.get(`${BASE_URL}/side/name/exist`).query({
			name: name
		});
		return res.body.exist;
	}

	async createSide(side: InitialStateSide): Promise<Side> {
		const res = await this.post(`${BASE_URL}/side`).send(side);
		return new Side(res['body']);
	}

	async createFullSide(side: InitialStateSide, channels: any, userInvited: any[]): Promise<Side> {
		const res = await this.post(`${BASE_URL}/side/create`).send({
			side: side,
			channels: channels,
			userInvited: userInvited
		});
		return new Side(res['body']);
	}

	async updateSide(side: InitialStateUpdateSide, id: string): Promise<Side> {
		const res = await this.patch(`${BASE_URL}/side/${id}`).send(side);
		return new Side(res['body']);
	}
	async updateSideStatus(status: SideStatus, id: string): Promise<Side> {
		const res = await this.post(`${BASE_URL}/side/update-status`).send({
			id: id,
			status: status
		});
		return new Side(res['body']);
	}
	async updateSideDao(activate: boolean, id: string): Promise<boolean> {
		const res = await this.post(`${BASE_URL}/side/update-dao`).send({
			id: id,
			isDaoActive: activate
		});
		return true;
	}
	async getMany(ids: string[]): Promise<Side[]> {
		const res = await this.get(`${BASE_URL}/side/getMany`).query({
			ids: ids
		});
		return dtoToSideList(res['body']);
	}
	async removeSide(sideId: string): Promise<any> {
		const response = await this.delete(`${BASE_URL}/side/${sideId}`);
		return response;
	}
}
export default SideService.getInstance();

export async function getSidesMetadata(sides: any[], userCollectionsData?: any, userSides?: Side[]): Promise<Side[]> {
	const sidesList: Side[] = await Promise.all(
		sides.map(async (side: Side) => {
			const firstCollectionSide = side.collectionSides[0];
			if (firstCollectionSide) {
				const firstCollection = firstCollectionSide.collection;
				const conditions = Object.keys(side.conditions);
				conditions.pop();
				const count = side.collectionSides.length;
				let parsedSide = side;
				parsedSide.firstCollection = firstCollection;
				parsedSide.collectionsCount = count;
				if (!_.isEmpty(userCollectionsData)) {
					// eslint-disable-next-line
					const [_, eligible] = checkUserEligibility(userCollectionsData, parsedSide);
					parsedSide.eligible = eligible;
				}
				if (userSides) {
					parsedSide.joined = !!userSides?.filter(side => side.id === parsedSide.id)?.[0];
				}
				return parsedSide;
			}
			return new Side({});
		})
	);
	return sidesList;
}

function dtoToSide(s: any): Side {
	return new Side(s);
}

function dtoToSideList(sides: any[]): Side[] {
	return sides.map((s: any) => dtoToSide(s));
}
