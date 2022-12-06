import { isString } from 'lodash';
import { Side } from '../Side';
import { NFT } from './nft';

export class Collection {
	address: string;
	name: string;
	symbol: string;
	tokenType: string;
	totalSupply: string;
	collectionName: string;
	imageUrl: string;
	description: string;
	slug: string;
	bannerUrl: string;
	isSpam: boolean;
	totalBalance: number;
	numDistinctTokensOwned: number;
	ownedCount: number;
	sideCount: number | undefined;
	floorPrice: number;
	totalVolume: number;
	traits: Trait[];
	nfts: NFT[] = [];
	sides: Side[] = [];
	media: any[];
	safelistRequestStatus: OpenSeaRequestStatus;

	constructor(_data: any) {
		this.address = _data.address;
		this.isSpam = _data.isSpam;
		this.media = _data.media;
		this.name = _data.name;
		this.numDistinctTokensOwned = _data.numDistinctTokensOwned;
		this.symbol = _data.symbol;
		this.tokenType = _data.tokenType;
		this.totalSupply = _data.totalSupply;
		this.totalBalance = _data.totalBalance;
		this.imageUrl = _data.imageUrl;
		this.description = _data.description;
		this.slug = _data.slug;
		this.floorPrice = _data.floorPrice;
		this.safelistRequestStatus = _data.safelistRequestStatus;
		this.bannerUrl = _data.bannerUrl;
		this.totalVolume = _data.totalVolume;
		this.ownedCount = _data.ownedCount;
		this.sideCount = 0;
		this.collectionName = _data.collectionName;
		this.traits = _data.traits ? JSON.parse(_data.traits) : [];
		this.sides = _data.sides || [];
	}

	getName() {
		return this.collectionName || this.name || 'Missing name data';
	}

	getCollectionProperties() {
		return this.traits.reduce(function (filtered: any, current) {
			if (current.values.length > 0) {
				filtered.push({
					property: {
						label: current['type'],
						value: current['type']
					},
					values: [
						...current.values.map(v => {
							return { label: v, value: v };
						})
					],
					values_used: []
				});
			}
			return filtered;
		}, []);
	}

	getPropertiesOwnedByUser() {
		if (this.nfts.length > 0) {
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
		} else {
			return [];
		}
	}
}

export interface Trait {
	type: string;
	values: string[];
}

export enum OpenSeaRequestStatus {
	verified = 'verified',
	approved = 'approved',
	requested = 'requested',
	not_requested = 'not_requested',
	disabled_top_trending = 'disabled_top_trending'
}
