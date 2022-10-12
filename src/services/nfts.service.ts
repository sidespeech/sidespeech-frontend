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
}
export default NftsService.getInstance();
