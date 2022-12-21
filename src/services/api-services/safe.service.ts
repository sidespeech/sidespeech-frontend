import { BASE_URL } from "../../constants/constants";
import { Safe } from "../../models/Safe";
import { BaseApiService } from "./base-api.service";
import SafeModel, { SafeFactory, SafeAccountConfig, ContractNetworksConfig } from '@safe-global/safe-core-sdk';
import { ethers } from 'ethers';
import EthersAdapter from '@safe-global/safe-ethers-lib'

// Create an API Service class
let instance: SafeService;
class SafeService extends BaseApiService {

  static getInstance() {
    if (!instance) instance = new SafeService();
    return instance;
  }

  async savednewSafe(data: Safe) {
    const res = await this.post(`${BASE_URL}/gnosis-safe/${data['sideId']}`).send(data);
    return new Safe(res['body']);
  }

  async createSafe(signer: ethers.providers.JsonRpcSigner, ownerAddress:string, sideId:string, profileId:string) {
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });
    const safeFactory = await SafeFactory.create({ ethAdapter })
    const owners = [ownerAddress]
    const threshold = 1
    const safeAccountConfig: SafeAccountConfig = {
        owners,
        threshold,
    }
    const safeSdk: SafeModel = await safeFactory.deploySafe({ safeAccountConfig })
    const newSafeAddress = safeSdk.getAddress();
    const safe = await this.savednewSafe({
        contractAddress : newSafeAddress,
        threshold: threshold,
        sideId : sideId,
        profileId : profileId
    });
    console.log('safe created :', safe);
  }


}

export default SafeService.getInstance();
