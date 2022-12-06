import { Collection } from './collection';

export class AlchemyCollection extends Collection {
	constructor(_data: any) {
		const data = {
			address: _data.address,
			symbol: _data.symbol,
			tokenType: _data.tokenType,
			totalSupply: _data.totalSupply,
			totalBalance: _data.totalBalance,
			isSpam: _data.isSpam,
			numDistinctTokensOwned: _data.numDistinctTokensOwned,
			ownedCount: _data.ownedCount,
			media: _data.media,
			sideCount: 0,
			name: _data.name,
			sides: _data.sides || [],
			collectionName: _data.opensea?.collectionName,
			floorPrice: _data.opensea?.floorPrice,
			description: _data.opensea?.description,
			safelistRequestStatus: _data.opensea?.safelistRequestStatus,
			imageUrl: _data.opensea?.imageUrl,
			bannerUrl: ''
		};
		super(data);
	}
}
