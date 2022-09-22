import _ from "lodash";
import { Dictionary } from "lodash";
import Web3 from "web3";

export class UserTokensData {
  public ERC721: Dictionary<any[]>;
  public ERC1155: Dictionary<any[]>;
  public ERC20Tokens: Erc20Token[] | undefined;
  constructor(public total: number, allResults: any[]) {
    const groupedByAddress = _.groupBy(allResults, "contract_type");
    const erc721 = groupedByAddress.ERC721;
    this.ERC721 = _.groupBy(erc721, "name");
    const erc1155 = groupedByAddress.ERC1155;
    this.ERC1155 = _.groupBy(erc1155, "name");
  }
}

export class Erc20Token {
  public token_address: string;
  public name: string;
  public symbol: string;
  public decimals: number;
  public balance: string;
  public logo?: string | undefined;
  public thumbnail?: string | undefined;
  constructor(data: any) {
    this.token_address = data.token_address;
    this.name = data.name;
    this.symbol = data.symbol;
    this.decimals = data.decimals;
    this.balance = data.balance;
    this.logo = data.logo
      ? data.logo
      : `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${data.token_address}/logo.png`;
    this.thumbnail = data.thumbnail;
  }

  getDecimalsBalance(): number {
    const balance = Web3.utils.toBN(this.balance);
    const diviser = Web3.utils.toBN(10 ** this.decimals);
    return Number.parseFloat(balance.div(diviser).toString());
  }
}
