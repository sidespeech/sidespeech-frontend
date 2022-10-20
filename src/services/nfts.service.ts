import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";
import { MORALIS_API_KEY } from "../constants/constants";

class NftsService {
  private static instance: NftsService;

  private constructor() {}

  public static getInstance(): NftsService {
    if (!NftsService.instance) {
      NftsService.instance = new NftsService();
    }

    (async function startMoralis() {
      await Moralis.start({ apiKey: MORALIS_API_KEY });
    })();

    return NftsService.instance;
  }

  async getNftsOwnedByAddress(address: string): Promise<any> {
    let allResults: any[] = [];
    let cursor = null;
    do {
      let response: any = await Moralis.EvmApi.nft.getWalletNFTs({
        address,
        chain: EvmChain.ETHEREUM,
        cursor: cursor,
      });
      allResults = allResults.concat(response.data.result);
      cursor = response.data.cursor;
    } while (cursor !== "" && cursor !== null);
    return allResults;
  }

  async getAllCollectionsForUser(address: string): Promise<any> {
    let allResults: any[] = [];
    let cursor = null;
    do {
      let response: any = await Moralis.EvmApi.nft.getWalletNFTCollections({
        address,
        chain: EvmChain.ETHEREUM,
        cursor: cursor,
      });
      allResults = allResults.concat(response.data.result);
      cursor = response.data.cursor;
    } while (cursor !== "" && cursor !== null);
    return allResults;
  }
  async getAllNftsCollectionByContractAddress(address: string): Promise<any> {
    let allResults: any[] = [];
    let cursor = null;
    do {
      let response: any = await Moralis.EvmApi.nft.getContractNFTs({
        address,
        chain: EvmChain.ETHEREUM,
        cursor: cursor,
      });
      allResults = allResults.concat(response.data.result);
      cursor = response.data.cursor;
    } while (cursor !== "" && cursor !== null);
    return allResults;
  }
  /**
   * @description Get an array of nfts datas and add missing metadata if needed
   * @param datas array of nfts datas
   * @returns Array of nfts data with missing metadata
   */
  async getMissingMetadata(datas: any[]): Promise<any[]> {
    datas.forEach(async (element) => {
      if (element.token_uri && element.metadata === null) {
        try {
          const data = await fetch(element.token_uri);
          element.metadata = JSON.stringify(data);
        } catch (error: any) {}
      }
    });
    return datas;
  }
}
export default NftsService.getInstance();
