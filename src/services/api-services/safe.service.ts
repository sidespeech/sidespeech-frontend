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
import { Transaction, TxStatus } from "../../models/Transaction";

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

  async saveTransaction(data:any, provider: ethers.providers.Web3Provider) {
    console.log('data :', data);
  }

  async connectToExistingSafe(signer: ethers.providers.JsonRpcSigner, safeAddress: string) {
    const ethAdapter = new EthersAdapter({ ethers, signerOrProvider: signer });
    const safeSdk = await Safe.create({ ethAdapter, safeAddress });
    console.log('safeSdk :', safeSdk);
    console.log('safeSdk.getAddress() :', safeSdk.getAddress());
    return safeSdk
  }

  async createSafeTransaction(safeSdk: Safe, signer: ethers.providers.JsonRpcSigner, to_address: string, value: string, provider : ethers.providers.Web3Provider) {

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
    console.log('safeTransaction :', safeTransaction);

    const formatedSafeTransaction = await this.getFormatedSafeTransaction(safeTransaction, safeSdk);
    console.log('formatedSafeTransaction :', formatedSafeTransaction);

    // signature of owned 1 is offchain
    const signedSafeTransaction = await safeSdk.signTransaction(safeTransaction)
    console.log('signedSafeTransaction :', signedSafeTransaction);

    const executeTxResponse = await safeSdk.executeTransaction(safeTransaction);
    console.log('executeTxResponse :', executeTxResponse);

    const formatedTransaction = await this.getFormatedTransaction(executeTxResponse['hash'], provider);
    console.log('formatedTransaction :', formatedTransaction);

    // TODO Add saving tx in db

  }

  async buySafeNft(safeSdk: Safe, signer: ethers.providers.JsonRpcSigner, nft_address: string) {


    // const contractInterface = new ethers.utils.Interface(OPENSEA_ABI);
    const openSeaContract = new ethers.Contract(OPENSEA_ADDRESS, OPENSEA_ABI, signer);

    // const BuyOpenSeaNFT = await openSeaContract.fulfillAdvancedOrder()

    const contractData = await openseaService.getContractDataTestnet('0xcf00947d6c04a28a4c40026a8e6b03f3d83a0022/114');
    console.log('contractData :', contractData)

    // const dataTransaction = {
    //   considerationToken : '0x0000000000000000000000000000000000000000',
    //   considerationIdentifier : '0',
    //   considerationAmount : ethers.utils.parseEther(priceInEther)
    // }

    // const data = contractInterface.encodeFunctionData('fulfillBasicOrder', [
    //     nft_address,
    //     ethers.utils.parseUnits(value,"ether").toString()
    // ]);

    // const safeTransactionData: SafeTransactionDataPartial = {
    //   to: OPENSEA_ADDRESS,
    //   value: ethers.utils.parseUnits(value,"ether").toString(),
    //   data: data,
    //   gasPrice: 28000,
    //   baseGas: 28000,
    //   safeTxGas: 28000,
    // }


  }

  async createRegularTransaction(signer: ethers.providers.JsonRpcSigner, to_address: string, value: string, provider : ethers.providers.Web3Provider) {

    const transaction = {
      to: to_address,
      value: ethers.utils.parseEther(value),
    };

    // Now we can sign and send the transaction using the Signer
    const executeTxResponse = await signer.sendTransaction(transaction);
    console.log('executeTxResponse :', executeTxResponse);
    
    const formatedTransaction = await this.getFormatedTransaction(executeTxResponse['hash'], provider);
    console.log('formatedTransaction :', formatedTransaction)

    // TODO Add saving tx in db

  }

  async getTransactionsByAddressByBlock(address: string, provider: ethers.providers.Web3Provider, fromBlock:number|'latest', toBlock:number|'latest') {
    // Get all logs from the contract
    const logs = await provider.getLogs({
      address: address,
      fromBlock: fromBlock,
      toBlock: toBlock,
    });

    // Start with an empty array of transactions
    let transactions:any = [];
    // Iterate over the logs
    for (const log of logs) {
      const formattedTransaction = await this.getFormatedTransaction(log.transactionHash, provider);
      transactions.push(formattedTransaction);
    }
    return transactions
  }

  async getFormatedTransaction(hash: string, provider: ethers.providers.Web3Provider) {

    // Get the transaction details
    const etherTransactionReceipt = await provider.waitForTransaction(hash);
    const etherTransaction = await provider.getTransaction(hash);

    const formattedTransaction:Transaction = {
      txHash : etherTransactionReceipt['transactionHash'],
      status : etherTransactionReceipt['status'] || 0,
      blockNumber : etherTransaction['blockNumber'] || 0,
      from : etherTransaction['from'],
      to : etherTransaction['to'] || '0x',
      gasFee : ethers.utils.formatEther(etherTransaction['gasPrice']!.mul(etherTransactionReceipt['gasUsed']).toString()),
      value : ethers.utils.formatEther(etherTransaction['value']!.toString()),
      data : etherTransaction['data'],
      nonce : etherTransaction['nonce'] || 0,
      r : etherTransaction['r'] || '0x',
      s : etherTransaction['s'] || '0x',
      transactionIndex : etherTransactionReceipt['transactionIndex'],
    }

    return formattedTransaction
  }

  async getFormatedSafeTransaction(transaction: any, safeSdk: Safe) {

    // Get the transaction details
    const safeTransactionHash = await safeSdk.getTransactionHash(transaction);

    const formattedTransaction:Transaction = {
      txHash : safeTransactionHash,
      status : TxStatus.Success,
      blockNumber : 0,
      from : safeSdk.getAddress(),
      to : transaction['data']['to'] || '0x',
      gasFee : '0.0',
      value : ethers.utils.formatEther(transaction['data']['value']),
      data : transaction['data']['data'],
      nonce : transaction['data']['nonce'],
      r : '0x',
      s : '0x',
      transactionIndex : 0,
    }

    return formattedTransaction
  }
  
  async payOutMembers(safeSdk: Safe, provider: ethers.providers.Web3Provider) {
    let transactions = await this.getTransactionsByAddressByBlock(safeSdk.getAddress(), provider, 0, 'latest');
    console.log('transactions :', transactions)
  }


}

export default SafeService.getInstance();
