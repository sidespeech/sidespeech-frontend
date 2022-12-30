import { BASE_URL, OPENSEA_ADDRESS } from "../../constants/constants";
import { GnosisSafe } from "../../models/GnosisSafe";
import { BaseApiService } from "./base-api.service";
import Safe, { SafeFactory, SafeAccountConfig, ContractNetworksConfig, SafeDeploymentConfig } from '@safe-global/safe-core-sdk';
import { getMultiSendDeployment, getMultiSendCallOnlyDeployment, getSafeL2SingletonDeployment, getProxyFactoryDeployment, getFallbackHandlerDeployment, getSignMessageLibDeployment, getCreateCallDeployment } from '@gnosis.pm/safe-deployments';
import { SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'
import { ethers } from 'ethers';
import EthersAdapter, { EthersTransactionOptions } from '@safe-global/safe-ethers-lib'
import openseaService from '../../services/web3-services/opensea.service';
import { ABI, OPENSEA_ABI } from "../../constants/ABI";
import { Transaction } from "../../models/Transaction";

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



  async createSafe(signer: ethers.providers.JsonRpcSigner, ownerAddress: string, sideId: string, profileId: string) {
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });

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
      contractAddress: newSafeAddress,
      threshold: threshold,
      sideId: sideId,
      profileId: profileId
    });
    console.log('safe created :', safe);
  }

  async connectToExistingSafe(signer: ethers.providers.JsonRpcSigner, safeAddress: string) {
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });
    const safeSdk = await Safe.create({ ethAdapter, safeAddress });
    console.log('safeSdk :', safeSdk);
    console.log('safeSdk.getAddress() :', safeSdk.getAddress());
    return safeSdk
  }

  async createSafeTransaction(safeSdk: Safe, signer: ethers.providers.JsonRpcSigner, to_address: string, value: string) {

    const contractInterface = new ethers.utils.Interface(ABI);

    const data = contractInterface.encodeFunctionData('transfer', [
      to_address,
      ethers.utils.parseUnits(value, "ether").toString()
    ]);

    const safeTransactionData: SafeTransactionDataPartial = {
      to: to_address,
      value: ethers.utils.parseUnits(value, "ether").toString(),
      data: data,
      gasPrice: 28000,
      baseGas: 28000,
      safeTxGas: 28000,
    }

    const safeTransaction = await safeSdk.createTransaction({ safeTransactionData })
    // signature of owned 1 is offchain
    const signedSafeTransaction = await safeSdk.signTransaction(safeTransaction)

    const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);
    console.log('executeTxResponse :', executeTxResponse);
  }

  async buySafeNft(safeSdk: Safe, signer: ethers.providers.JsonRpcSigner, nft_address: string, value: string) {

    const contractInterface = new ethers.utils.Interface(OPENSEA_ABI);

    const data = contractInterface.encodeFunctionData('fulfillBasicOrder', [
        nft_address,
        ethers.utils.parseUnits(value,"ether").toString()
    ]);

    const safeTransactionData: SafeTransactionDataPartial = {
      to: OPENSEA_ADDRESS,
      value: ethers.utils.parseUnits(value,"ether").toString(),
      data: data,
      gasPrice: 28000,
      baseGas: 28000,
      safeTxGas: 28000,
    }


  }

  async createRegularTransaction(signer: ethers.providers.JsonRpcSigner, to_address: string, value: string) {

    const transaction = {
      to: to_address,
      value: ethers.utils.parseEther(value),
    };

    // Now we can sign and send the transaction using the Signer
    const executeTxResponse = await signer.sendTransaction(transaction);
    console.log('executeTxResponse :', executeTxResponse);

  }

  async getAllTransactions(address: string, provider: ethers.providers.Web3Provider) {
    // Get all logs from the contract
    const logs = await provider.getLogs({
      address: address,
      fromBlock: 0,
      toBlock: 'latest',
    });

    // Start with an empty array of transactions
    let transactions:any = [];
    // Iterate over the logs
    for (const log of logs) {
      // Get the transaction details
      const etherTransaction = await provider.getTransactionReceipt(log.transactionHash);
      console.log('etherTransaction :', etherTransaction);
      // const formattedTransaction = {
      //   txHash : etherTransaction['hash'],
      //   blockNumber : etherTransaction['blockNumber'] || 0,
      //   chainId : etherTransaction['chainId'],
      //   from : etherTransaction['from'],
      //   to : etherTransaction['to'] || '0x',
      //   gasPrice : ethers.utils.formatEther(etherTransaction['gasPrice']!.toString()),
      //   value : ethers.utils.formatEther(etherTransaction['value']!.toString()),
      //   data : etherTransaction['data'],
      //   nonce : etherTransaction['nonce'] || 0,
      //   r : etherTransaction['r'] || '0x',
      //   s : etherTransaction['s'] || '0x',
      //   transactionIndex : ('transactionIndex' in etherTransaction) ? etherTransaction['transactionIndex'] : 1,
      // }
      // transactions.push(formattedTransaction);
    }
    return transactions
  }
  
  async payOutMembers(safeSdk: Safe, provider: ethers.providers.Web3Provider) {
    let transactions = await this.getAllTransactions(safeSdk.getAddress(), provider);
    console.log('transactions :', transactions)
  }


}

export default SafeService.getInstance();
