import { isString } from 'lodash';
import { Side } from '../Side';
import { NFT } from './nft';

export class Collection {
	public address: string;
	public name: string;
	public symbol: string;
	public tokenType: string;
	public totalSupply: string;
	public opensea?: OpenSeaData;
	public totalBalance: number;
	public isSpam: boolean;
	public nfts: NFT[] = [];
	public numDistinctTokensOwned: number;
	public ownedCount: number;
	public media: any[];
	public sideCount: number | undefined;
	public traits: Trait[];
	sides: Side[] = [];
	constructor(_data: any) {
		this.address = _data.address;
		this.name = _data.opensea?.collectionName || _data.name || 'No name data';
		this.symbol = _data.symbol;
		this.tokenType = _data.tokenType;
		this.totalSupply = _data.totalSupply;
		this.totalBalance = _data.totalBalance;
		this.isSpam = _data.isSpam;
		this.numDistinctTokensOwned = _data.numDistinctTokensOwned;
		this.ownedCount = _data.ownedCount;
		this.media = _data.media;
		this.sideCount = 0;
		this.opensea = _data.opensea
			? // if string, data comes from database and has to be deserialized
			  typeof _data.opensea === 'string'
				? JSON.parse(_data.opensea)
				: _data.opensea
			: null;
		this.traits = _data.traits ? JSON.parse(_data.traits) : [];
		this.sides = _data.sides || [];
	}

	getCollectionProperties() {
		return this.nfts.reduce(function (filtered: any, current) {
			const metadata = current['metadata'];
			if (metadata['attributes']) {
				const attributes = metadata['attributes'];
				if (Array.isArray(attributes)) {
					for (let attribute of attributes) {
						let property_exists =
							filtered.filter(function (o: any) {
								return o['property']['value'] == attribute['trait_type'];
							}).length > 0;
						if (property_exists) {
							for (let element of filtered) {
								if (element['property']['value'] == attribute['trait_type']) {
									let value_exists =
										element['values'].filter(function (o: any) {
											return o['value'] == attribute['value'];
										}).length > 0;
									if (!value_exists)
										element['values'].push({
											label: attribute['value'],
											value: attribute['value']
										});
								}
							}
						} else {
							filtered.push({
								property: {
									label: attribute['trait_type'],
									value: attribute['trait_type']
								},
								values: [{ label: attribute['value'], value: attribute['value'] }],
								values_used: []
							});
						}
					}
				}
			}
			return filtered;
		}, []);
	}
}

interface OpenSeaData {
	floorPrice: number;
	collectionName: string;
	safelistRequestStatus: OpenSeaRequestStatus;
	imageUrl: string;
	description: string;
	externalUrl: string;
	twitterUsername: string;
	discordUrl: string;
	lastIngestedAt: string;
}

export interface Trait {
	type: string;
	values: string[];
}

export enum OpenSeaRequestStatus {
	verified = 'verified',
	approved = 'approved',
	requested = 'requested',
	not_requested = 'not_requested'
}
