import { NUMBER_OF_DECIMALS } from '../constants/constants';
import { Duration } from 'date-fns';
import { Side } from '../models/Side';
import { NFT } from '../models/interfaces/nft';
import { Collection, OpenSeaRequestStatus } from '../models/interfaces/collection';
import { groupBy } from 'lodash';

export function weiToDecimals(value: number, exposant: number = NUMBER_OF_DECIMALS) {
	return value / 10 ** exposant;
}
export function decimalsToWei(value: number, exposant: number = NUMBER_OF_DECIMALS) {
	return value * 10 ** exposant;
}

export function reduceWalletAddress(address: string): string {
	if (!address) return '';
	const name = address.substring(0, 6) + '...' + address.substring(address.length - 4, address.length);
	return name;
}
export function reduceTokenId(id: string): string {
	let reducedId = '';
	if (!id) return '';
	if (id.length > 10) {
		reducedId = id.substring(0, 4) + '...' + id.substring(id.length - 4, id.length);
	}
	return reducedId;
}
export function reduceWalletAddressForColor(address: string): string {
	if (!address) return '';
	const notAllowerChar = ['0', '1', '2', '3', '4', '5'];
	const replaceChar = ['A', 'B', 'C', 'D', 'E', 'F'];
	const splitName = address.substring(2, 8).split('');
	const result = splitName.map((letter, index) => {
		if (notAllowerChar.includes(letter.toUpperCase())) return replaceChar[index].toLowerCase();
		return letter;
	});
	return `#${result.join('')}`;
}

export function renameFile(originalFile: File, newName: string): File {
	return new File([originalFile], newName, {
		type: originalFile.type,
		lastModified: originalFile.lastModified
	});
}

export function getRoleColor(role: string | number) {
	switch (role) {
		case 'User' || 2:
			return 'text-blue';
		case 2:
			return 'text-blue';
		case 'Sub-Admin':
		case 'Moderator1':
		case 'Moderator2':
			return 'text-green';
		case 'Administrator':
			return 'text-red';
		case 1:
			return 'text-red';
		default:
			return 'text-blue';
	}
}
export function getRoleColorForStyle(role: string) {
	switch (role) {
		case 'User':
			return 'var(--blue)';
		case 'Moderator':
			return 'var(--green)';
		case 'Admin':
			return 'var(--red)';
		default:
			return 'var(--blue)';
	}
}

/**
 *
 * @param tokenBalance number of token in the user wallet
 * @param nodePrice the price of the Bcash the user wanted to buy
 * @returns true if the user has anaf token
 */
export function hasAnafToken(tokenBalance: number, nodePrice: number): boolean {
	return tokenBalance >= nodePrice;
}

export const durationToString = (duration: Duration | null, _default: string) => {
	if (!duration) return _default;
	return `${duration.years || duration.years !== 0 ? duration.years + 'y ' : ''}${
		duration.months || duration.months !== 0 ? duration.months + 'm ' : ''
	}${duration.days || duration.days !== 0 ? duration.days + 'd ' : ''} ${
		duration.hours && duration.hours < 10 ? '0' + duration.hours : duration.hours || '00'
	}:${duration.minutes && duration.minutes < 10 ? '0' + duration.minutes : duration.minutes || '00'}:${
		duration.seconds && duration.seconds < 10 ? '0' + duration.seconds : duration.seconds || '00'
	}`;
};
export const durationToStringMax1h = (duration: Duration | null, _default: string) => {
	if (!duration) return _default;
	if (duration.days || duration.hours) return 'More than 1h ago';
	else {
		return `${duration.minutes && duration.minutes < 10 ? '0' + duration.minutes : duration.minutes || '00'} min ${
			duration.seconds && duration.seconds < 10 ? '0' + duration.seconds : duration.seconds || '00'
		} sec ago`;
	}
};

export function timestampToLocalString(timestamp: string) {
	return new Date(Number.parseInt(timestamp)).toLocaleTimeString();
}

export async function connectedWallet() {
	const account = await window.ethereum.request({ method: 'eth_accounts' });
	return account.length > 0 ? account[0] : null;
}

export interface ElligibilityResponse {
	[key: string]: { numberNeeded: any; propertyResults: any[] };
}
export function hasTraitInCollection(collection: Collection, trait: string): boolean {
	if (!collection || !collection.nfts) return false;
	return collection.nfts.some(nft => nft.metadata.attributes.find(a => a.trait_type.toLowerCase() === trait));
}
export function hasTraitValueInCollection(collection: Collection, trait: string, value: string): boolean {
	if (!collection || !collection.nfts) return false;
	return (
		collection?.nfts.find(nft =>
			nft.metadata.attributes.find(a => a.trait_type.toLowerCase() === trait && a.value.toLowerCase() === value)
		) !== undefined
	);
}
export function checkEligibilityByCondition(conditions: any, nfts: NFT[]): boolean {
	const res: { [key: string]: boolean[] } = {};
	const groupedNfts = groupBy(nfts, 'token_address');
	const keys = Object.keys(conditions);
	// pop to remove the required object in the conditions
	keys.pop();
	keys.forEach((address: string) => {
		const condition = conditions[address];
		res[address] = [];
		if (!groupedNfts[address]) res[address].push(false);
		else {
			const anafNft = groupedNfts[address].length >= condition['numberNeeded'];
			if (!anafNft) res[address].push(false);
			else res[address].push(true);
			if (condition['features'] && condition['features'].length) {
				for (let feature of condition['features']) {
					const type = feature['property'].toLowerCase();
					const value = feature['value'].toLowerCase();
					const meetCondition = groupedNfts[address].some(nft =>
						nft.metadata.attributes.some(
							a => a['trait_type'].toLowerCase() === type && a['value'].toLowerCase() === value
						)
					);
					if (!meetCondition) res[address].push(false);
					else res[address].push(true);
				}
			}
		}
	});
	if (conditions['required']) return Object.values(res).some(r => r[0] === true && r.some(a => a));
	else return Object.values(res).every(r => r[0] === true && r.some(a => a));
}

export function checkUserEligibility(nfts: any, selectedSide: Side): [ElligibilityResponse, boolean] {
	const res: ElligibilityResponse = {};
	if (selectedSide) {
		selectedSide.collectionSides?.forEach(item => {
			const token_address = item['collectionId'];
			res[token_address] = { numberNeeded: 1, propertyResults: [] };
			const collection = nfts[token_address];
			const metadataSides = selectedSide.metadataSides.filter(data => data.metadata.address === token_address);
			const condition = {
				numberNeeded: item!['numberNeeded']
			};
			if (!collection) {
				res[token_address]['numberNeeded'] = createResponseObject(
					false,
					[],
					`You need ${condition['numberNeeded']} nfts more to meet the condition.`,
					token_address,
					condition,
					'number'
				);
			} else {
				res[token_address]['numberNeeded'] = validateNumberOfNfts(condition, collection);
			}
			metadataSides?.forEach((item, index) => {
				const tab = [];
				const condition = {
					trait_type: item['metadata']['traitProperty'],
					trait_value: item['metadata']['traitValue']
				};

				if (!collection) {
					tab.push(
						validateNftsWithAttributes([], condition, {
							address: token_address
						})
					);
				} else {
					// get nfts from collection with needed attributes
					const filteredNfts = getNftsWithAttributes(collection.nfts, condition);
					// if no nfts corresponding to the condition returning error response
					tab.push(validateNftsWithAttributes(filteredNfts, condition, collection));
				}
				res[token_address]['propertyResults'] = res[token_address]['propertyResults']
					? [...res[token_address]['propertyResults'], ...tab]
					: tab;
			});
		});
	}

	let eligible = false;
	if (Object.keys(res).length > 0) {
		eligible = isEligible(res, selectedSide['required']);
	}
	return [res, eligible];
}

function validateNftsWithAttributes(nfts: any[], condition: any, collection: Partial<Collection>) {
	const nftsNotEmpty = nfts.length > 0;
	return createResponseObject(
		nftsNotEmpty,
		nfts,
		`No nft in the collection ${collection.address} with property ${condition['trait_type']} and value ${condition['trait_value']}`,
		collection.address || '',
		condition,
		'attributes'
	);
}

function validateNumberOfNfts(condition: any, collection: Collection | { nfts: any[]; address: string }) {
	// verifying number of needed NFTS from the collection
	const number: number = Number.parseInt(condition['numberNeeded']);
	const numberValidation = validateNumberOfNftsForCollection(number, collection.nfts.length);
	// creating response
	return createResponseObject(
		numberValidation,
		collection.nfts,
		`You need ${number - collection.nfts.length} nfts more to meet the condition.`,
		collection.address,
		condition,
		'number'
	);
}

function isEligible(result: ElligibilityResponse, required: boolean): boolean {
	if (required) {
		// verifying if all collection are fully success
		return Object.values(result).every(
			res =>
				(!res['propertyResults'].length ||
					res['propertyResults'].some(value => value.type.includes('success'))) &&
				res['numberNeeded'].type.includes('success')
		);
	} else {
		// verifying if one of the collection are fully success
		return Object.values(result).some(
			res =>
				(!res['propertyResults'].length ||
					res['propertyResults'].some(value => value.type.includes('success'))) &&
				res['numberNeeded'].type.includes('success')
		);
	}
}

function getNftsWithAttributes(nfts: any, condition: any) {
	return nfts.filter((nft: NFT) =>
		nft.metadata.attributes?.some(
			a =>
				condition['trait_type'].toLowerCase() === a.trait_type.toLowerCase() &&
				a.value.toLowerCase() === condition['trait_value'].toLowerCase()
		)
	);
}

function validateNumberOfNftsForCollection(numberRequired: number, ownedNumber: number) {
	return ownedNumber >= numberRequired;
}

function createResponseObject(valid: boolean, nfts: any, message: string, id: string, condition: any, type: string) {
	if (valid) {
		return {
			id: id,
			type: `success-${type}`,
			property: condition['trait_type'],
			value: condition['trait_value'],
			usefulNfts: nfts,
			numberNeeded: condition['numberNeeded']
		};
	} else {
		return {
			id: id,
			type: `error-${type}`,
			message: message,
			property: condition['trait_type'],
			value: condition['trait_value'],
			numberNeeded: condition['numberNeeded']
		};
	}
}

export function fixURL(url: string) {
	if (url.startsWith('ipfs://ipfs')) {
		return 'https://ipfs.io/' + url.split('ipfs://').slice(-1)[0];
	} else if (url.startsWith('ipfs')) {
		return 'https://ipfs.io/ipfs/' + url.split('ipfs://').slice(-1)[0];
	} else if (url.startsWith('https://')) {
		return url;
	} else {
		return url;
	}
}

export function alchemyNftsModelToSideNftsModel(nfts: any[]) {
	return nfts.map(nft => alchemyNftModelToSideNftModel(nft));
}
export function alchemyNftModelToSideNftModel(nft: any) {
	const sideNft = {
		name: nft.title,
		metadata: nft.rawMetadata,
		token_address: nft.contract.address,
		token_id: nft.tokenId,
		// token_uri: nft.tokenUri.raw,
		amount: nft.balance,
		description: nft.description,
		contract_type: nft.tokenType,
		symbol: nft.symbol
	};
	return sideNft;
}

export function getRandomId() {
	return Math.random().toString(36).slice(2);
}

export async function getBase64(file: File): Promise<any> {
	return new Promise((res, rej) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			if (reader.readyState === 2) {
				res(reader.result);
			}
		};
		reader.onerror = error => {
			console.error('Error: ', error);
			rej();
		};
	});
}

export function validateForm(formData: any) {
	if (formData.username && formData.bio) {
		return validateUsername(formData.username) && validateBio(formData.bio);
	}
}

export function validateUsername(username: string) {
	const re = new RegExp('^[a-zA-Z0-9]*$');
	const isValid = re.test(username);
	return isValid;
}

export function validateBio(bio: string) {
	const length = bio.length;
	const validLength = length <= 500;
	return validLength;
}
export function paginateArray({
	array,
	currentPage = 1,
	pageSize = 10
}: {
	array: any[];
	currentPage?: number;
	pageSize?: number;
}): {
	array: any[];
	pages: number;
} {
	const pages = currentPage <= 0 ? 1 : Math.ceil(array.length / pageSize);
	const slicedArray =
		currentPage <= 0
			? array
			: currentPage > pages
			? array.slice(pages, pageSize * pages)
			: array.slice(pageSize * (currentPage - 1), pageSize * currentPage);

	return {
		array: slicedArray,
		pages
	};
}

export const sortCollectionByVerifiedCollectionsAndVolume = (a: Collection, b: Collection) => {
	if (a.ownedCount && !b.ownedCount) return -1;
	else if (!a.ownedCount && b.ownedCount) return 1;
	else if (
		a.safelistRequestStatus === OpenSeaRequestStatus.verified &&
		b.safelistRequestStatus !== OpenSeaRequestStatus.verified
	)
		return -1;
	else if (
		a.safelistRequestStatus !== OpenSeaRequestStatus.verified &&
		b.safelistRequestStatus === OpenSeaRequestStatus.verified
	)
		return 1;
	else if (a.totalVolume < b.totalVolume) return 1;
	else if (a.totalVolume > b.totalVolume) return -1;
	else return 0;
};

export function generateDarkColorHex(): string {
	let color = '#';
	for (let i = 0; i < 3; i++)
		color += ('0' + Math.floor((Math.random() * Math.pow(16, 2)) / 2).toString(16)).slice(-2);
	return color;
}

export function isColor(string: string): boolean {
	return string?.startsWith('#');
}
export async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
	const type = dataUrl.match(/^data:(.+);base64/)?.[1];

	const res: Response = await fetch(dataUrl);
	const blob: Blob = await res.blob();
	return new File([blob], fileName, { type });
}
