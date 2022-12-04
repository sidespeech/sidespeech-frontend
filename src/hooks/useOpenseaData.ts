import { useEffect, useState } from 'react';
import { Trait } from '../models/interfaces/collection';
import collectionService from '../services/api-services/collection.service';
import openseaService from '../services/web3-services/opensea.service';

//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////fetching data from opensea, do not use in production without api-key////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

export default function useOpenseaCollection() {

	/**
	 * @description Update traits for all collection in database
	 */
	async function updateTraitsForAllDatabaseCollections() {
		// get all collection from database
		const allCollections = await collectionService.getAllCollections();
		// call opensea api every 3 second 5 requests by 5 requests to get contract data
		const slugs = await getSlug(allCollections.map(c => c.address));
		await getTraitsFromOpensea(slugs);
	}

	/**
	 *
	 * @param addresses addresses from which we need slug from opensea
	 * @param slugs slugs already saved in database
	 * @description Update needed collection data for given addresses or given slugs
	 */
	async function updateCollections(addresses?: string[], slugs?: string[]) {
		// if collections are already in database, no need to get slug from opensea
		if (!slugs && addresses) {
			const slugs = await getSlug(addresses);
			await saveOpenseaData(slugs);
		} else if (slugs) {
			await saveOpenseaData(slugs);
		}
	}

	return { updateCollections, updateTraitsForAllDatabaseCollections };
}
async function sleep(ms: any) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function getSlug(collectionsAddress: string[]) {
	let index = 0;
	let foo: any = [];
	do {
		collectionsAddress.slice(index, index + 4).forEach(async c => {
			const body = await openseaService.getContractData(c);
			const slug = body.collection.slug;
			foo = [...foo, slug];
		});
		index += 4;
		await sleep(3000);
	} while (index < collectionsAddress.length);
	const res = await Promise.all(foo);
	return res;
}

export async function saveOpenseaData(slugs: string[]) {
	let i = 0;
	do {
		slugs.slice(i, i + 4).forEach(async c => {
			const body = await openseaService.getCollectionData(c);
			const address = body.collection.primary_asset_contracts[0].address;
			const collection = {
				address,
				floorPrice: body['collection']['stats']['floor_price'],
				collectionName: body['collection']['name'],
				safelistRequestStatus: body['collection']['safelist_request_status'],
				imageUrl: body['collection']['image_url'],
				description: body['collection']['description'],
				bannerUrl: body['collection']['banner_image_url'],
				isSpam: false,
				totalVolume: body['collection']['stats']['total_volume'],
				slug: c
			};
			await collectionService.updateCollection(collection);
		});
		i += 4;
		await sleep(3000);
	} while (i < slugs.length);
}
async function getTraitsFromOpensea(slugs: string[]) {
	let i = 0;
	let a: any[] = [];
	let foo2: any = [];
	// for each slug, getting all collection data from opensea
	do {
		slugs.slice(i, i + 4).forEach(async c => {
			const body = await openseaService.getCollectionData(c);
			const traits = body.collection.traits;
			const address = body.collection.primary_asset_contracts[0].address;
			const mappedTraits: Trait[] = [];
			// get traits from the response
			Object.entries<any>(traits).map(([key, value]) => {
				const trait: Trait = {
					type: key,
					values: Object.keys(value)
				};
				mappedTraits.push(trait);
			});
			// update our collection with traits
			await collectionService.updateCollectionTraits(JSON.stringify(mappedTraits), address);
		});
		i += 4;
		await sleep(3000);
	} while (i < slugs.length);
}
