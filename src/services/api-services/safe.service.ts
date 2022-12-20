import { BASE_URL } from "../../constants/constants";
import { Safe } from "../../models/Safe";
import { BaseApiService } from "./base-api.service";


// Create an API Service class
let instance: SafeService;
class SafeService extends BaseApiService {

  static getInstance() {
    if (!instance) instance = new SafeService();
    return instance;
  }

  async savednewSafe(data: Safe) {
    const res = await this.post(`${BASE_URL}/gnosis-safe/${data['sideId']}`).send(data);
    console.log(res)
    return res;
  }


}

export default SafeService.getInstance();
