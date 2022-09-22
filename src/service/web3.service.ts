import Moralis from "moralis";
import Web3 from "web3";
import { HTTP_URL_PROVIDER } from "../constants/constants";

// TODO does not work well, optimization issues, take to much time.
export async function getContractCreatorAddress() {
  const web3 = new Web3(Web3.givenProvider || HTTP_URL_PROVIDER);
  let currentBlockNum = await web3.eth.getBlockNumber();
  let txFound = false;
  const contractAddress = "0xD6F75a20Aa64634743D40fAfa88473020302C530";
  while (currentBlockNum >= 0 && !txFound) {
    const block = await web3.eth.getBlock(currentBlockNum, true);
    const transactions = block.transactions;
    console.log(block);
    for (let j = 0; j < transactions.length; j++) {
      // We know this is a Contract deployment
      if (!transactions[j].to) {
        const receipt = await web3.eth.getTransactionReceipt(
          transactions[j].hash
        );
        if (
          receipt.contractAddress &&
          receipt.contractAddress.toLowerCase() ===
            contractAddress.toLowerCase()
        ) {
          txFound = true;
          console.log(`Contract Creator Address: ${transactions[j].from}`);
          break;
        }
      }
    }

    currentBlockNum--;
  }
}
export async function getTransactionsByAccount(
  myaccount: string,
  startBlockNumber: number,
  endBlockNumber: number | null
) {
  const web3 = new Web3(Web3.givenProvider);
  
  if (endBlockNumber == null) {
    endBlockNumber = await web3.eth.getBlockNumber();
    console.log("Using endBlockNumber: " + endBlockNumber);
  }
  if (startBlockNumber == null) {
    startBlockNumber = endBlockNumber - 1000;
    console.log("Using startBlockNumber: " + startBlockNumber);
  }
  console.log(
    'Searching for transactions to/from account "' +
      myaccount +
      '" within blocks ' +
      startBlockNumber +
      " and " +
      endBlockNumber
  );

  for (var i = startBlockNumber; i <= endBlockNumber; i++) {
    if (i % 1000 == 0) {
      console.log("Searching block " + i);
    }
    var block = await web3.eth.getBlock(i, true);
    console.log(block);
    if (block != null && block.transactions != null) {
      block.transactions.forEach(function (e) {

        if (myaccount === e.from || myaccount === e.to) {
          console.log(
            "  tx hash          : " +
              e.hash +
              "\n" +
              "   nonce           : " +
              e.nonce +
              "\n" +
              "   blockHash       : " +
              e.blockHash +
              "\n" +
              "   blockNumber     : " +
              e.blockNumber +
              "\n" +
              "   transactionIndex: " +
              e.transactionIndex +
              "\n" +
              "   from            : " +
              e.from +
              "\n" +
              "   to              : " +
              e.to +
              "\n" +
              "   value           : " +
              e.value +
              "\n" +
              "   time            : " +
              "\n" +
              "   gasPrice        : " +
              e.gasPrice +
              "\n" +
              "   gas             : " +
              e.gas +
              "\n" +
              "   input           : " +
              e.input
          );
        }
      });
    }
  }
}
