import { BASE_URL } from "../../constants/constants";
import { Transaction } from "../../models/Transaction";
import { BaseApiService } from "./base-api.service";

// Create an API Service class
let instance: TransactionService;
class TransactionService extends BaseApiService {

  static getInstance() {
    if (!instance) instance = new TransactionService();
    return instance;
  }

  async saveTransaction(transaction:Transaction) {
    const res = await this.post(`${BASE_URL}/transactions`).send(transaction);
    return new Transaction(res['body']);
  }


}

export default TransactionService.getInstance();
