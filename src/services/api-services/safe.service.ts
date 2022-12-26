import { BASE_URL } from "../../constants/constants";
import { GnosisSafe } from "../../models/GnosisSafe";
import { BaseApiService } from "./base-api.service";
import Safe, { SafeFactory, SafeAccountConfig, ContractNetworksConfig, SafeDeploymentConfig } from '@safe-global/safe-core-sdk';
import { getMultiSendDeployment, getMultiSendCallOnlyDeployment, getSafeL2SingletonDeployment, getProxyFactoryDeployment, getFallbackHandlerDeployment, getSignMessageLibDeployment, getCreateCallDeployment } from '@gnosis.pm/safe-deployments';
import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'
import { ethers } from 'ethers';
import EthersAdapter, { EthersTransactionOptions } from '@safe-global/safe-ethers-lib'
import openseaService from '../../services/web3-services/opensea.service';
import { ERC20ABI, ERC721ABI } from "../../constants/ABI";

// Create an API Service class
let instance: SafeService;
class SafeService extends BaseApiService {

  static getInstance() {
    if (!instance) instance = new SafeService();
    return instance;
  }

  async savednewSafe(data: GnosisSafe) {
    const res = await this.post(`${BASE_URL}/gnosis-safe/${data['sideId']}`).send(data);
    return new GnosisSafe(res['body']);
  }


  
  async createSafe(signer: ethers.providers.JsonRpcSigner, ownerAddress:string, sideId:string, profileId:string) {
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });

    // const chainId = await ethAdapter.getChainId();    
    // const contractNetworks: ContractNetworksConfig = {
    //   [chainId]: {
    //     multiSendAddress:
    //       getMultiSendDeployment()!.networkAddresses[chainId.toString()],
    //     multiSendCallOnlyAddress:
    //       getMultiSendCallOnlyDeployment()!.networkAddresses[chainId.toString()],
    //     safeMasterCopyAddress:
    //       getSafeL2SingletonDeployment()!.networkAddresses[chainId.toString()],
    //     safeProxyFactoryAddress:
    //       getProxyFactoryDeployment()!.networkAddresses[chainId.toString()],
    //     fallbackHandlerAddress:
    //       getFallbackHandlerDeployment()!.networkAddresses[chainId.toString()],
    //     signMessageLibAddress:
    //       getSignMessageLibDeployment()!.networkAddresses[chainId.toString()],
    //     createCallAddress:
    //       getCreateCallDeployment()!.networkAddresses[chainId.toString()]
    //   }
    // };

    const callback = (txHash: string): void => {
      console.log({ txHash })
    }

    const safeFactory = await SafeFactory.create({ ethAdapter })
    const owners = [ownerAddress]
    const threshold = 1
    const safeAccountConfig: SafeAccountConfig = {
        owners,
        threshold,
    }
    const safeSdk: Safe = await safeFactory.deploySafe({ safeAccountConfig, callback })
    const newSafeAddress = safeSdk.getAddress();
    const safe = await this.savednewSafe({
        contractAddress : newSafeAddress,
        threshold: threshold,
        sideId : sideId,
        profileId : profileId
    });
    console.log('safe created :', safe);
  }

  async connectToExistingSafe(signer: ethers.providers.JsonRpcSigner, safeAddress:string) {
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });
    const safeSdk = await Safe.create({ ethAdapter, safeAddress});
    console.log('safeSdk :', safeSdk);
    console.log('safeSdk.getAddress() :', safeSdk.getAddress());
    return safeSdk
    // const safeTransactionData: SafeTransactionDataPartial = {to: }
  }

  async createSafeTransaction(safeSdk:Safe, address:string, id:number, signer: ethers.providers.JsonRpcSigner) {

    const abi = ERC20ABI;

    const contractInterface = new ethers.utils.Interface(abi);
    const data = contractInterface.encodeFunctionData('transfer', [
        address,
        ethers.utils.parseUnits('1')
    ]);

    console.log('data :', data);

    const data_contract = await openseaService.getContractDataTestnet(`${address}/${id}`);
    console.log('data_contract :', data_contract)

    const safeTransactionData: SafeTransactionDataPartial = {
      to: address,
      value: ethers.utils.parseUnits("0.001","ether").toString(),
      data: data,
      gasPrice: 28000,
      baseGas: 28000,
      safeTxGas: 28000,
    }




    console.log('safeTransactionData :', safeTransactionData);

    const safeTransaction = await safeSdk.createTransaction({ safeTransactionData })

    console.log('safeTransaction :', safeTransaction);

    // const txHash = await safeSdk.getTransactionHash(safeTransaction)
    // console.log('txHash :', txHash);

    // const options: EthersTransactionOptions = {
    //   gasLimit: ethers.utils.parseUnits("0.0006","ether").toNumber()
    // }

    // console.log('options :', options);

    // const txResponse = await safeSdk.approveTransactionHash(txHash, options)
    // console.log('txResponse :', txResponse);

    // signature of owned 1 is offchain
    const signedSafeTransaction = await safeSdk.signTransaction(safeTransaction)

    console.log('signedSafeTransaction :', signedSafeTransaction);

    const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);

    console.log('executeTxResponse :', executeTxResponse);


  }


}

export default SafeService.getInstance();
