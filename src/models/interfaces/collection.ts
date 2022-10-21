import { NFT } from "./nft";

export interface Collection {
    address: string,
    name: string,
    symbol: string,
    nfts: NFT[],
}