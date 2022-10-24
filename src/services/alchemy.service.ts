import { Network, Alchemy, NftContract } from "alchemy-sdk";
import { alchemyNftModelToSideNftModel } from "../helpers/utilities";
import { Collection } from "../models/interfaces/collection";

// // Print owner's wallet address:
// const ownerAddr = "0xshah.eth";
// console.log("fetching NFTs for address:", ownerAddr);
// console.log("...");

// // Print total NFT count returned in the response:
// const nftsForOwner = await alchemy.nft.getNftsForOwner("0xshah.eth");
// console.log("number of NFTs found:", nftsForOwner.totalCount);
// console.log("...");

// // Print contract address and tokenId for each NFT:
// for (const nft of nftsForOwner.ownedNfts) {
//   console.log("===");
//   console.log("contract address:", nft.contract.address);
//   console.log("token ID:", nft.tokenId);
// }
// console.log("===");

// // Fetch metadata for a particular NFT:
// console.log("fetching metadata for a Crypto Coven NFT...");
// const response = await alchemy.nft.getNftMetadata(
//   "0x5180db8F5c931aaE63c74266b211F580155ecac8",
//   "1590"
// );

// // Uncomment this line to see the full api response:
// // console.log(response);

// // Print some commonly used fields:
// console.log("NFT name: ", response.title);
// console.log("token type: ", response.tokenType);
// console.log("tokenUri: ", response.tokenUri.gateway);
// console.log("image url: ", response.rawMetadata.image);
// console.log("time last updated: ", response.timeLastUpdated);
// console.log("===");

class AlchemyService {
  private static instance: AlchemyService;
  private static alchemy: Alchemy;

  private constructor() {}

  public static getInstance(): AlchemyService {
    if (!AlchemyService.instance) {
      AlchemyService.instance = new AlchemyService();
    }

    (async function startMoralis() {
      // Optional Config object, but defaults to demo api-key and eth-mainnet.
      const settings = {
        apiKey: "CceqrR9PDp3YFbyTwRrx2Vpi5a3Pb5HF", // Replace with your Alchemy API Key.
        network: Network.ETH_MAINNET, // Replace with your network.
      };

      AlchemyService.alchemy = new Alchemy(settings);
      //   await Moralis.start({ apiKey: MORALIS_API_KEY });
    })();

    return AlchemyService.instance;
  }

  async getUserNfts(address: string): Promise<any> {
    let allResults: any[] = [];
    let pageKey = undefined;
    do {
      let response: any = await AlchemyService.alchemy.nft.getNftsForOwner(
        address,
        { pageKey: pageKey }
      );
      allResults = allResults.concat(response.ownedNfts);
      pageKey = response.pageKey;
    } while (pageKey !== "" && pageKey !== undefined);
    console.log(allResults);
    const toSideNftModel = allResults.map((v) =>
      alchemyNftModelToSideNftModel(v)
    );
    console.log(toSideNftModel);
    return toSideNftModel;
  }
  async getContractMetadata(address: string): Promise<Collection> {
    const res = await fetch(
      `https://eth-mainnet.g.alchemy.com/nft/v2/CceqrR9PDp3YFbyTwRrx2Vpi5a3Pb5HF/getContractMetadata?contractAddress=${address}`
    );
    const data = await res.json();
    const collection = new Collection(data);
    return collection;
  }
}
export default AlchemyService.getInstance();
